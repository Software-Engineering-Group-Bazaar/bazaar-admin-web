import React, { useEffect, useState, useRef } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { apiGetAllAdsAsync } from '../api/api.js';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
const HUB_ENDPOINT_PATH = '/Hubs/AdvertisementHub';
const HUB_URL = `${baseUrl}${HUB_ENDPOINT_PATH}`;

function getLast12Months() {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(
      d.toLocaleString('default', { month: 'short', year: 'numeric' })
    );
  }
  return months;
}

function generateTargets(realValues, minOffset = -0.1, maxOffset = 0.15) {
  return realValues.map((item) => {
    const offset = minOffset + Math.random() * (maxOffset - minOffset);
    return Math.round(item * (1 + offset));
  });
}

const AdsRevenueChart = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const [chartData, setChartData] = useState({
    conversions: [],
    clicks: [],
    views: [],
  });
  const [ads, setAds] = useState([]);
  const connectionRef = useRef(null);

  // Helper to recalculate chart data
  const calculateChartData = (ads) => {
    const months = getLast12Months();

    const revenueData = {
      conversions: Array(12).fill(0),
      clicks: Array(12).fill(0),
      views: Array(12).fill(0),
    };

    for (const ad of ads) {
      const startDate = new Date(ad.startTime);
      const endDate = new Date(ad.endTime);

      for (let i = 0; i < 12; i++) {
        const monthStart = new Date();
        monthStart.setMonth(monthStart.getMonth() - (11 - i), 1);
        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1);

        if (startDate < monthEnd && endDate >= monthStart) {
          revenueData.conversions[i] +=
            (ad.conversions || 0) * (ad.conversionPrice || 0);
          revenueData.clicks[i] += (ad.clicks || 0) * (ad.clickPrice || 0);
          revenueData.views[i] += (ad.views || 0) * (ad.viewPrice || 0);
        }
      }
    }

    // Generate targets
    const conversionsTargets = generateTargets(revenueData.conversions);
    const clicksTargets = generateTargets(revenueData.clicks);
    const viewsTargets = generateTargets(revenueData.views);

    // Prepare final chart data
    setChartData({
      conversions: months.map((month, i) => ({
        month,
        revenue: revenueData.conversions[i],
        target: conversionsTargets[i],
      })),
      clicks: months.map((month, i) => ({
        month,
        revenue: revenueData.clicks[i],
        target: clicksTargets[i],
      })),
      views: months.map((month, i) => ({
        month,
        revenue: revenueData.views[i],
        target: viewsTargets[i],
      })),
    });
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const adsResponse = await apiGetAllAdsAsync();
        const adsData = adsResponse.data || [];
        setAds(adsData);
        calculateChartData(adsData);
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

        if (!updatedAds.some((ad) => ad.id === updatedAd.id)) {
          updatedAds.push(updatedAd);
        }

        calculateChartData(updatedAds);
        return updatedAds;
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
  }, []);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: 420,
        borderRadius: 4,
        boxShadow: 6,
        p: 3,
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant='h6' fontWeight={600}>
          {tab === 0 && t('analytics.conversionsRevenue')}
          {tab === 1 && t('analytics.clicksRevenue')}
          {tab === 2 && t('analytics.viewsRevenue')}
        </Typography>
        <Tabs
          value={tab}
          onChange={handleChange}
          textColor='primary'
          indicatorColor='primary'
        >
          <Tab label={t('analytics.conversions')} />
          <Tab label={t('analytics.clicks')} />
          <Tab label={t('analytics.views')} />
        </Tabs>
      </Box>

      <ResponsiveContainer width='100%' height={300}>
        <LineChart
          data={
            chartData[
              tab === 0 ? 'conversions' : tab === 1 ? 'clicks' : 'views'
            ]
          }
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='month' />
          <YAxis tickFormatter={(v) => `$${Math.round(v / 1000)}K`} />
          <Tooltip formatter={(val) => `$${val}`} />
          <Legend />
          <Line
            type='monotone'
            dataKey='revenue'
            stroke='#0f766e'
            strokeWidth={2}
            name={t('analytics.totalRevenue')}
          />
          <Line
            type='monotone'
            dataKey='target'
            stroke='#f59e0b'
            strokeWidth={2}
            name={t('analytics.target')}
            strokeDasharray='5 5'
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default AdsRevenueChart;
