import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { apiGetAllAdsAsync } from '../api/api.js';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const gaugeColor = '#0F766E';
const bgColor = '#E5E7EB';
const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
const HUB_ENDPOINT_PATH = '/Hubs/AdvertisementHub';
const HUB_URL = `${baseUrl}${HUB_ENDPOINT_PATH}`;

const UserDistribution = () => {
  const [conversionRate, setConversionRate] = useState(0);
  const [totalConversions, setTotalConversions] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [ads, setAds] = useState([]);
  const connectionRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const adsResponse = await apiGetAllAdsAsync();
        const adsData = adsResponse.data;
        setAds(adsData);

        // Calculate initial conversions and clicks
        const totalConversions = adsData.reduce(
          (sum, ad) => sum + (ad.conversions || 0),
          0
        );
        const totalClicks = adsData.reduce(
          (sum, ad) => sum + (ad.clicks || 0),
          0
        );

        setTotalConversions(totalConversions);
        setTotalClicks(totalClicks);
        setConversionRate(
          totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
        );
      } catch (error) {
        console.error('Error fetching initial ads data:', error);
      }
    };

    fetchInitialData();

    // Initialize SignalR connection
    const jwtToken = localStorage.getItem('token');
    if (!jwtToken) {
      console.warn('No JWT token found. SignalR connection not started.');
      return;
    }

    const newConnection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => jwtToken,
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging(LogLevel.Information)
      .build();

    connectionRef.current = newConnection;

    const startConnection = async () => {
      try {
        await newConnection.start();
        console.log('SignalR Connected to AdvertisementHub!');
      } catch (err) {
        console.error('SignalR Connection Error:', err);
      }
    };

    startConnection();

    // Register event handlers
    newConnection.on('ReceiveAdUpdate', (updatedAd) => {
      console.log('Received Ad Update:', updatedAd);
      setAds((prevAds) => {
        const updatedAds = prevAds.map((ad) =>
          ad.id === updatedAd.id ? updatedAd : ad
        );

        // If the ad is new, add it
        if (!updatedAds.some((ad) => ad.id === updatedAd.id)) {
          updatedAds.push(updatedAd);
        }

        // Recalculate conversions and clicks
        const totalConversions = updatedAds.reduce(
          (sum, ad) => sum + (ad.conversions || 0),
          0
        );
        const totalClicks = updatedAds.reduce(
          (sum, ad) => sum + (ad.clicks || 0),
          0
        );

        setTotalConversions(totalConversions);
        setTotalClicks(totalClicks);
        setConversionRate(
          totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
        );

        return updatedAds;
      });
    });

    newConnection.on('ReceiveClickTimestamp', () => {
      console.log('Received Click Timestamp');
      setTotalClicks((prev) => {
        const newTotalClicks = prev + 1;
        setConversionRate(
          newTotalClicks > 0 ? (totalConversions / newTotalClicks) * 100 : 0
        );
        return newTotalClicks;
      });
    });

    newConnection.on('ReceiveConversionTimestamp', () => {
      console.log('Received Conversion Timestamp');
      setTotalConversions((prev) => {
        const newTotalConversions = prev + 1;
        setConversionRate(
          totalClicks > 0 ? (newTotalConversions / totalClicks) * 100 : 0
        );
        return newTotalConversions;
      });
    });

    // Cleanup on unmount
    return () => {
      if (
        connectionRef.current &&
        connectionRef.current.state === 'Connected'
      ) {
        console.log('Stopping SignalR connection on component unmount.');
        connectionRef.current
          .stop()
          .catch((err) =>
            console.error('Error stopping SignalR connection:', err)
          );
      }
    };
  }, [totalClicks, totalConversions]);

  const gaugeData = [
    { name: 'Conversion Rate', value: conversionRate, color: gaugeColor },
    { name: 'Remaining', value: 100 - conversionRate, color: bgColor },
  ];

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flexShrink: 0 }}>
        <Typography variant='h6' align='center'>
          Conversion Rate (All Ads)
        </Typography>
        <Typography variant='body2' align='center' color='text.secondary'>
          {totalConversions} conversions / {totalClicks} clicks
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={gaugeData}
              dataKey='value'
              startAngle={180}
              endAngle={0}
              innerRadius='60%'
              outerRadius='80%'
              cornerRadius={10}
            >
              {gaugeData.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Box
          sx={{
            position: 'absolute',
            top: '48%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant='h5' sx={{ color: 'primary.dark' }}>
            {totalClicks > 0 ? conversionRate.toFixed(1) : 0}%
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default UserDistribution;
