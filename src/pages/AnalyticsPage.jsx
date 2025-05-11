import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import KpiCard from '@components/KpiCard';
import AnalyticsChart from '@components/AnalyticsChart';
import CountryStatsPanel from '@components/CountryStatsPanel';
import OrdersByStatus from '@components/OrdersByStatus';
import UserDistribution from '@components/UserDistribution';
import RevenueByStore from '@components/RevenueByStore';
import ParetoChart from '@components/ParetoChart';
import AdFunnelChart from '@components/AdFunnelChart';
import AdStackedBarChart from '@components/AdStackedBarChart';
import Calendar from '@components/Calendar';
import DealsChart from '@components/DealsChart';
import SalesChart from '@components/SalesChart';
import { useState, useEffect, useRef } from 'react';
import {
  apiGetAllAdsAsync,
  apiFetchOrdersAsync,
  apiFetchAllUsersAsync,
  apiGetAllStoresAsync,
  apiGetStoreProductsAsync,
} from '../api/api.js';
import { format, parseISO } from 'date-fns';
import { subMonths } from 'date-fns';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

// Define the SignalR connection endpoint
const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
const HUB_ENDPOINT_PATH = '/Hubs/AdvertisementHub';
const HUB_URL = `${baseUrl}${HUB_ENDPOINT_PATH}`;

const AnalyticsPage = () => {
  const [ads, setAds] = useState([]);
  const [kpi, setKpi] = useState({
    totalViews: 0,
    totalClicks: 0,
    totalConversions: 0,
    totalConversionRevenue: 0,
    totalAds: 0,
    activeAds: 0,
    topAds: [],
    totalClicksRevenue: 0,
    totalViewsRevenue: 0,
    totalProducts: 0,
    viewsChange: 0,
    clicksChange: 0,
    conversionsChange: 0,
    conversionRevenueChange: 0,
    clicksRevenueChange: 0,
    viewsRevenueChange: 0,
    productsChange: 0,
    totalAdsChange: 0,
  });

  // For tracking SignalR connection status
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [lastError, setLastError] = useState('');
  const connectionRef = useRef(null);

  // For tracking real-time events
  const [clickTimeStamps, setClickTimeStamps] = useState([]);
  const [viewTimeStamps, setViewTimeStamps] = useState([]);
  const [conversionTimeStamps, setConversionTimeStamps] = useState([]);
  const [realtimeEvents, setRealtimeEvents] = useState([]);

  // Setup SignalR connection
  useEffect(() => {
    const jwtToken = localStorage.getItem('token');

    if (!jwtToken) {
      console.warn(
        'AnalyticsPage: No JWT token found. SignalR connection not started.'
      );
      setConnectionStatus('Auth Token Missing');
      return;
    }

    // Build the connection
    const newConnection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => jwtToken, // Crucial for JWT auth
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000]) // Retry times in ms, then stop
      .configureLogging(LogLevel.Information) // Or LogLevel.Debug for more detail
      .build();

    connectionRef.current = newConnection;
    setConnectionStatus('Connecting...');

    const startConnection = async () => {
      try {
        await newConnection.start();
        console.log('SignalR Connected to AdvertisementHub!');
        setConnectionStatus('Connected');
        setLastError('');
      } catch (err) {
        console.error('SignalR Connection Error: ', err);
        setConnectionStatus(
          `Error: ${err.message ? err.message.substring(0, 150) : 'Unknown connection error'}`
        );
        setLastError(err.message || 'Failed to connect');
      }
    };

    startConnection();

    // Register event handlers for messages from the server
    newConnection.on('ReceiveAdUpdate', (advertisement) => {
      console.log('Received Ad Update:', advertisement);

      // Update the ads array by replacing the updated ad
      setAds((prevAds) => {
        const adIndex = prevAds.findIndex((ad) => ad.id === advertisement.id);

        // Ako već postoji, zamijeni
        if (adIndex !== -1) {
          const updatedAds = [...prevAds];
          updatedAds[adIndex] = advertisement;
          calculateKpis(updatedAds);
          return updatedAds;
        }

        // Ako ne postoji, dodaj novi
        const updatedAds = [advertisement, ...prevAds];
        calculateKpis(updatedAds);
        return updatedAds;
      });

      // Add to realtime events log
      setRealtimeEvents((prev) => [
        { type: 'Ad Update', data: advertisement, time: new Date() },
        ...prev.slice(0, 19), // Keep last 20 events
      ]);
    });

    newConnection.on('ReceiveClickTimestamp', (timestamp) => {
      console.log('Received Click Timestamp:', timestamp);

      // Add to click timestamps
      setClickTimeStamps((prev) => [...prev, timestamp]);

      // Add to realtime events log
      setRealtimeEvents((prev) => [
        {
          type: 'Click',
          data: new Date(timestamp).toLocaleTimeString(),
          time: new Date(),
        },
        ...prev.slice(0, 19),
      ]);
    });

    newConnection.on('ReceiveViewTimestamp', (timestamp) => {
      console.log('Received View Timestamp:', timestamp);

      // Add to view timestamps
      setViewTimeStamps((prev) => [...prev, timestamp]);

      // Add to realtime events log
      setRealtimeEvents((prev) => [
        {
          type: 'View',
          data: new Date(timestamp).toLocaleTimeString(),
          time: new Date(),
        },
        ...prev.slice(0, 19),
      ]);
    });

    newConnection.on('ReceiveConversionTimestamp', (timestamp) => {
      console.log('Received Conversion Timestamp:', timestamp);

      // Add to conversion timestamps
      setConversionTimeStamps((prev) => [...prev, timestamp]);

      // Add to realtime events log
      setRealtimeEvents((prev) => [
        {
          type: 'Conversion',
          data: new Date(timestamp).toLocaleTimeString(),
          time: new Date(),
        },
        ...prev.slice(0, 19),
      ]);
    });

    // Handle connection events
    newConnection.onclose((error) => {
      console.warn('SignalR connection closed.', error);
      setConnectionStatus('Disconnected');
      if (error) {
        setLastError(`Connection closed due to error: ${error.message}`);
      }
    });

    newConnection.onreconnecting((error) => {
      console.warn('SignalR attempting to reconnect...', error);
      setConnectionStatus('Reconnecting...');
      setLastError(
        error ? `Reconnection attempt failed: ${error.message}` : ''
      );
    });

    newConnection.onreconnected((connectionId) => {
      console.log('SignalR reconnected successfully with ID:', connectionId);
      setConnectionStatus('Connected');
      setLastError('');
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
  }, []); // Empty dependency array: run once on mount

  // Initial data fetch
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Fetch all necessary data
      const ordersData = await apiFetchOrdersAsync();
      const usersResponse = await apiFetchAllUsersAsync();
      const users = usersResponse.data;
      const stores = await apiGetAllStoresAsync();

      // Fetch ads
      const adsResponse = await apiGetAllAdsAsync();
      const adsData = adsResponse.data;
      console.log('Initial Ads Data:', adsData);

      // Set ads state
      setAds(adsData);

      // Calculate products
      let totalProducts = 0;
      for (const store of stores) {
        const { data: products } = await apiGetStoreProductsAsync(store.id);
        totalProducts += products.length;
      }

      // Calculate KPIs with the fetched data
      calculateKpis(adsData, totalProducts);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  // Function to calculate KPIs from ads data
  const calculateKpis = (adsData, totalProductsCount = kpi.totalProducts) => {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Filter ads by current and previous month
    const adsThisMonth = adsData.filter(
      (ad) =>
        new Date(ad.startTime) >= currentMonthStart &&
        new Date(ad.startTime) <= now
    );
    const adsPrevMonth = adsData.filter(
      (ad) =>
        new Date(ad.startTime) >= previousMonthStart &&
        new Date(ad.startTime) <= previousMonthEnd
    );

    // Calculate change percentages
    const totalAdsChange = adsPrevMonth.length
      ? ((adsThisMonth.length - adsPrevMonth.length) / adsPrevMonth.length) *
        100
      : 100;

    // Views calculations
    const totalViewsThisMonth = adsThisMonth.reduce(
      (sum, ad) => sum + (ad.views || 0),
      0
    );
    const totalViewsPrevMonth = adsPrevMonth.reduce(
      (sum, ad) => sum + (ad.views || 0),
      0
    );
    const viewsChange = totalViewsPrevMonth
      ? ((totalViewsThisMonth - totalViewsPrevMonth) / totalViewsPrevMonth) *
        100
      : 100;

    // Clicks calculations
    const totalClicksThisMonth = adsThisMonth.reduce(
      (sum, ad) => sum + (ad.clicks || 0),
      0
    );
    const totalClicksPrevMonth = adsPrevMonth.reduce(
      (sum, ad) => sum + (ad.clicks || 0),
      0
    );
    const clicksChange = totalClicksPrevMonth
      ? ((totalClicksThisMonth - totalClicksPrevMonth) / totalClicksPrevMonth) *
        100
      : 100;

    // Conversions calculations
    const totalConversionsThisMonth = adsThisMonth.reduce(
      (sum, ad) => sum + (ad.conversions || 0),
      0
    );
    const totalConversionsPrevMonth = adsPrevMonth.reduce(
      (sum, ad) => sum + (ad.conversions || 0),
      0
    );
    const conversionsChange = totalConversionsPrevMonth
      ? ((totalConversionsThisMonth - totalConversionsPrevMonth) /
          totalConversionsPrevMonth) *
        100
      : 100;

    // Revenue calculations
    const totalConversionRevenueThisMonth = adsThisMonth.reduce(
      (sum, ad) => sum + (ad.conversionPrice || 0),
      0
    );
    const totalConversionRevenuePrevMonth = adsPrevMonth.reduce(
      (sum, ad) => sum + (ad.conversionPrice || 0),
      0
    );
    const conversionRevenueChange = totalConversionRevenuePrevMonth
      ? ((totalConversionRevenueThisMonth - totalConversionRevenuePrevMonth) /
          totalConversionRevenuePrevMonth) *
        100
      : 100;

    const totalClicksRevenueThisMonth = adsThisMonth.reduce(
      (sum, ad) => sum + (ad.clickPrice * ad.clicks || 0),
      0
    );
    const totalClicksRevenuePrevMonth = adsPrevMonth.reduce(
      (sum, ad) => sum + (ad.clickPrice * ad.clicks || 0),
      0
    );
    const clicksRevenueChange = totalClicksRevenuePrevMonth
      ? ((totalClicksRevenueThisMonth - totalClicksRevenuePrevMonth) /
          totalClicksRevenuePrevMonth) *
        100
      : 100;

    const totalViewsRevenueThisMonth = adsThisMonth.reduce(
      (sum, ad) => sum + (ad.viewPrice * ad.views || 0),
      0
    );
    const totalViewsRevenuePrevMonth = adsPrevMonth.reduce(
      (sum, ad) => sum + (ad.viewPrice * ad.views || 0),
      0
    );
    const viewsRevenueChange = totalViewsRevenuePrevMonth
      ? ((totalViewsRevenueThisMonth - totalViewsRevenuePrevMonth) /
          totalViewsRevenuePrevMonth) *
        100
      : 100;

    // Active ads count
    const activeAds = adsData.filter((ad) => ad.isActive).length;

    // Top ads by conversion revenue
    const topAds = [...adsData]
      .sort((a, b) => (b.conversionPrice || 0) - (a.conversionPrice || 0))
      .slice(0, 5);

    // Update KPI state
    setKpi({
      totalViews: totalViewsThisMonth,
      totalClicks: totalClicksThisMonth,
      totalConversions: totalConversionsThisMonth,
      totalConversionRevenue: totalConversionRevenueThisMonth.toFixed(2),
      totalAds: adsData.length,
      activeAds: activeAds,
      topAds: topAds,
      totalClicksRevenue: totalClicksRevenueThisMonth.toFixed(2),
      totalViewsRevenue: totalViewsRevenueThisMonth.toFixed(2),
      totalProducts: totalProductsCount,
      viewsChange: viewsChange.toFixed(2),
      clicksChange: clicksChange.toFixed(2),
      conversionsChange: conversionsChange.toFixed(2),
      conversionRevenueChange: conversionRevenueChange.toFixed(2),
      clicksRevenueChange: clicksRevenueChange.toFixed(2),
      viewsRevenueChange: viewsRevenueChange.toFixed(2),
      productsChange: 100, // We don't recalculate this here
      totalAdsChange: totalAdsChange.toFixed(2),
    });
  };

  // Custom component to display real-time events (optional)
  const RealtimeEventsList = () => (
    <Box
      sx={{
        bgcolor: 'background.paper',
        p: 2,
        borderRadius: 1,
        boxShadow: 1,
        maxHeight: 300,
        overflowY: 'auto',
      }}
    >
      <Typography variant='h6' sx={{ mb: 1, fontWeight: 'bold' }}>
        Realtime Events ({connectionStatus})
      </Typography>
      {realtimeEvents.length === 0 ? (
        <Typography variant='body2' color='text.secondary'>
          No events received yet
        </Typography>
      ) : (
        realtimeEvents.map((event, index) => (
          <Box
            key={index}
            sx={{ mb: 1, pb: 1, borderBottom: '1px solid #f0f0f0' }}
          >
            <Typography
              variant='body2'
              color='primary'
              sx={{ fontWeight: 'bold' }}
            >
              {event.type}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {new Date(event.time).toLocaleTimeString()}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        pl: 42,
        pr: 4,
        pt: 4,
        pb: 8,
        height: '100vh',
        overflowY: 'auto',

        /* --- Moderni custom scrollbar --- */
        '&::-webkit-scrollbar': {
          width: 8,
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(15, 118, 110, 0.6)', // tvoja primarna tamno-zelena
          borderRadius: 4,
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: 'rgba(15, 118, 110, 0.8)',
        },

        /* FireFox */
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(15,118,110,0.6) transparent',
      }}
    >
      <Typography
        variant='h4'
        sx={{
          fontWeight: 900,
          fontSize: { xs: '1.4rem', md: '2rem' },
          letterSpacing: '0.3px',
          mb: 4,
          color: 'primary.dark',
          lineHeight: 1.2,
        }}
      >
        Dashboard Analytics{' '}
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 'normal',
            color: connectionStatus === 'Connected' ? 'green' : 'orange',
          }}
        >
          ({connectionStatus})
        </span>
      </Typography>

      {/* KPI sekcija */}
      <Grid container spacing={3} mb={3} width={1200}>
        <Grid item xs={12} md={2.4}>
          <KpiCard
            label='Total Ads'
            value={kpi.totalAds}
            percentageChange={kpi.totalAdsChange}
            type='totalAds'
          />
        </Grid>
        <Grid item xs={12} md={2.4}>
          <KpiCard
            label='Total Views (All Ads)'
            value={kpi.totalViews}
            percentageChange={kpi.viewsChange}
            type='views'
          />
        </Grid>
        <Grid item xs={12} md={2.4}>
          <KpiCard
            label='Total Clicks (All Ads)'
            value={kpi.totalClicks}
            percentageChange={kpi.clicksChange}
            type='clicks'
          />
        </Grid>
        <Grid item xs={12} md={2.4}>
          <KpiCard
            label='Total Conversions (All Ads)'
            value={kpi.totalConversions}
            percentageChange={kpi.conversionsChange}
            type='conversionRevenue'
          />
        </Grid>
        <Grid item xs={12} md={2.4}>
          <KpiCard
            label='Total Conversions Revenue'
            value={kpi.totalConversionRevenue}
            percentageChange={kpi.conversionRevenueChange}
            type='conversionRevenue'
          />
        </Grid>
        <Grid item xs={12} md={2.4}>
          <KpiCard
            label='Total Clicks Revenue'
            value={kpi.totalClicksRevenue}
            percentageChange={kpi.clicksRevenueChange}
            type='conversionRevenue'
          />
        </Grid>
        <Grid item xs={12} md={2.4}>
          <KpiCard
            label='Total Views Revenue'
            value={kpi.totalViewsRevenue}
            percentageChange={kpi.viewsRevenueChange}
            type='conversionRevenue'
          />
        </Grid>
        <Grid item xs={12} md={2.4}>
          <KpiCard
            label='Total Products'
            value={kpi.totalProducts}
            percentageChange={kpi.productsChange}
            type='activeAds'
          />
        </Grid>
      </Grid>

      {/* Glavni graf + countries */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={9}>
          <Box sx={{ height: 420, width: '850px' }}>
            <AnalyticsChart />
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ height: 420, width: '320px' }}>
            <CountryStatsPanel />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ width: 1210, mt: 4 }}>
        <Grid container spacing={2}>
          <Grid item sx={{ width: '32%' }}>
            <Box sx={{ height: 340, display: 'flex', flexDirection: 'column' }}>
              <OrdersByStatus />
            </Box>
          </Grid>
          <Grid item sx={{ width: '32%' }}>
            <Box sx={{ height: 340, display: 'flex', flexDirection: 'column' }}>
              <UserDistribution />
            </Box>
          </Grid>
          <Grid item sx={{ width: '32%' }}>
            <Box sx={{ height: 340, display: 'flex', flexDirection: 'column' }}>
              <RevenueByStore />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ width: '100%' }}>
          {/* Funnel Chart (sam u jednom redu) */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <AdFunnelChart />
              </Box>
            </Grid>
          </Grid>

          {/* Pareto Chart i Stacked Bar Chart (jedan do drugog) */}
          <Grid container spacing={6} mb={3}>
            <Grid item sx={{ width: '45%' }}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <ParetoChart />
              </Box>
            </Grid>
            <Grid item sx={{ width: '45%' }}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <AdStackedBarChart />
              </Box>
            </Grid>
          </Grid>

          {/* Calendar, DealsChart, SalesChart */}
          <Grid container spacing={3} mb={2}>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Calendar />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <DealsChart />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <SalesChart />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default AnalyticsPage;
