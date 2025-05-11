import React, { useEffect, useState, useRef } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  Legend,
} from 'recharts';
import { Box, Typography } from '@mui/material';
import { apiGetAllAdsAsync } from '../api/api.js';
import { format, parseISO } from 'date-fns';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
const HUB_ENDPOINT_PATH = '/Hubs/AdvertisementHub';
const HUB_URL = `${baseUrl}${HUB_ENDPOINT_PATH}`;

function groupByMonth(ads) {
  const byMonth = {};
  ads.forEach((ad) => {
    const date = ad.startTime || ad.endTime;
    if (!date) return;
    const month = format(parseISO(date), 'yyyy-MM');
    if (!byMonth[month])
      byMonth[month] = { month, clicks: 0, views: 0, conversions: 0 };
    byMonth[month].clicks += ad.clicks || 0;
    byMonth[month].views += ad.views || 0;
    byMonth[month].conversions += ad.conversions || 0;
  });
  return Object.values(byMonth).sort((a, b) => a.month.localeCompare(b.month));
}

const ParetoChart = () => {
  const [data, setData] = useState([]);
  const [ads, setAds] = useState([]);
  const connectionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const adsResponse = await apiGetAllAdsAsync();
      const adsData = adsResponse.data;
      setAds(adsData);
      updateChartData(adsData);
    };

    const updateChartData = (ads) => {
      const chartData = groupByMonth(ads).map((d) => ({
        time: format(parseISO(d.month + '-01'), 'MMM yyyy'),
        clicks: d.clicks,
        views: d.views,
        conversions: d.conversions,
      }));
      setData(chartData);
    };

    fetchData();

    // SignalR Setup
    const jwtToken = localStorage.getItem('token');
    if (!jwtToken) {
      console.warn('No JWT token found. SignalR connection not started.');
      return;
    }

    const connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => jwtToken,
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging(LogLevel.Information)
      .build();

    connectionRef.current = connection;

    const startConnection = async () => {
      try {
        await connection.start();
        console.log('SignalR Connected to AdvertisementHub!');
      } catch (err) {
        console.error('SignalR Connection Error:', err);
      }
    };

    startConnection();

    // Register event handlers
    connection.on('ReceiveAdUpdate', (updatedAd) => {
      setAds((prevAds) => {
        const updatedAds = prevAds.map((ad) =>
          ad.id === updatedAd.id ? updatedAd : ad
        );
        updateChartData(updatedAds);
        return updatedAds;
      });
    });

    // Cleanup on unmount
    return () => {
      if (
        connectionRef.current &&
        connectionRef.current.state === 'Connected'
      ) {
        connectionRef.current
          .stop()
          .catch((err) =>
            console.error('Error stopping SignalR connection:', err)
          );
      }
    };
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        padding: '30px',
        boxShadow: 3,
        width: '570px',
        height: '480px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography
        variant='h6'
        sx={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#333',
          marginBottom: '20px',
        }}
      >
        Pareto Chart
      </Typography>
      <ResponsiveContainer width='100%' height={350}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <XAxis dataKey='time' />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: '#333',
              color: '#fff',
              borderRadius: '8px',
              padding: '10px 15px',
              border: 'none',
              fontSize: '14px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
            }}
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
          />
          <Legend
            wrapperStyle={{
              bottom: -10,
              fontSize: '14px',
              fontWeight: 600,
            }}
            iconSize={14}
          />
          <Area
            type='monotone'
            dataKey='views'
            fill='#9c88ff'
            stroke='#9c88ff'
            fillOpacity={0.2}
            name='Views'
          />
          <Bar dataKey='clicks' barSize={30} fill='#333333' name='Clicks' />
          <Line
            type='monotone'
            dataKey='conversions'
            stroke='#4A90E2'
            strokeWidth={3}
            name='Conversions'
            dot={{ r: 6, fill: '#fff', stroke: '#4A90E2', strokeWidth: 3 }}
            activeDot={{
              r: 8,
              fill: '#fff',
              stroke: '#4A90E2',
              strokeWidth: 3,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ParetoChart;
