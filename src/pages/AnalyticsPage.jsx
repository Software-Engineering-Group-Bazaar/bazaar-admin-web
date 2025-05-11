import React from 'react';
import { Grid, Typography, Box, Pagination } from '@mui/material';
import KpiCard from '@components/KpiCard';
import AnalyticsChart from '@components/AnalyticsChart';
import CountryStatsPanel from '@components/CountryStatsPanel';
import OrdersByStatus from '@components/OrdersByStatus';
import UserDistribution from '@components/UserDistribution';
import RevenueByStore from '@components/RevenueByStore';
// --- Merged Imports ---
import ProductsSummary from '@components/ProductsSummary'; // From HEAD
import RevenueMetrics from '@components/RevenueMetrics'; // From HEAD
import ParetoChart from '@components/ParetoChart'; // From develop
import AdFunnelChart from '@components/AdFunnelChart'; // From develop
import AdStackedBarChart from '@components/AdStackedBarChart'; // From develop
import Calendar from '@components/Calendar'; // From develop
import DealsChart from '@components/DealsChart'; // From develop
import SalesChart from '@components/SalesChart'; // From develop
import { useState, useEffect, useRef } from 'react'; // useRef from develop

import {
  apiGetAllAdsAsync,
  apiFetchOrdersAsync, // Used in develop's fetchInitialData, not in HEAD's kpis
  apiFetchAllUsersAsync, // Used in develop's fetchInitialData, not in HEAD's kpis
  apiGetAllStoresAsync,
  apiGetStoreProductsAsync,
  apiFetchAdsWithProfitAsync, // From HEAD, for ProductsSummary
} from '../api/api.js';
// format and parseISO were in develop but not used in the conflicting part, subMonths is used by both
import { subMonths, format, parseISO } from 'date-fns'; // Added format, parseISO from develop imports
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'; // From develop

// --- SignalR Setup (from develop) ---
const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
const HUB_ENDPOINT_PATH = '/Hubs/AdvertisementHub';
const HUB_URL = `${baseUrl}${HUB_ENDPOINT_PATH}`;

const AnalyticsPage = () => {
  // --- State from develop ---
  const [ads, setAds] = useState([]); // For general ad data, updated by SignalR
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
    productsChange: 0, // Will be set based on logic
    totalAdsChange: 0,
  });
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [lastError, setLastError] = useState('');
  const connectionRef = useRef(null);
  const [clickTimeStamps, setClickTimeStamps] = useState([]);
  const [viewTimeStamps, setViewTimeStamps] = useState([]);
  const [conversionTimeStamps, setConversionTimeStamps] = useState([]);
  const [realtimeEvents, setRealtimeEvents] = useState([]);

  // --- State from HEAD (for product pagination and summary) ---
  const [products, setProducts] = useState([]); // For paginated product list
  const [adsDataForSummary, setAdsDataForSummary] = useState([]); // Specifically for ProductsSummary
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const PRODUCTS_PER_PAGE = 5; // Or your desired number

  // --- Pagination Logic (from HEAD) ---
  const handlePageChange = (event, value) => {
    setCurrentProductPage(value);
  };

  const paginatedProducts = products.slice(
    (currentProductPage - 1) * PRODUCTS_PER_PAGE,
    currentProductPage * PRODUCTS_PER_PAGE
  );

  const pageCount = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  // --- SignalR useEffect (from develop) ---
  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (!jwtToken) {
      console.warn(
        'AnalyticsPage: No JWT token found. SignalR connection not started.'
      );
      setConnectionStatus('Auth Token Missing');
      return;
    }
    const newConnection = new HubConnectionBuilder()
      .withUrl(HUB_URL, { accessTokenFactory: () => jwtToken })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging(LogLevel.Information)
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
          `Error: ${err.message ? err.message.substring(0, 150) : 'Unknown'}`
        );
        setLastError(err.message || 'Failed to connect');
      }
    };
    startConnection();

    newConnection.on('ReceiveAdUpdate', (advertisement) => {
      console.log('Received Ad Update:', advertisement);
      setAds((prevAds) => {
        const adIndex = prevAds.findIndex((ad) => ad.id === advertisement.id);
        const updatedAds = [...prevAds];
        if (adIndex !== -1) updatedAds[adIndex] = advertisement;
        else updatedAds.unshift(advertisement);
        calculateKpis(updatedAds, kpi.totalProducts); // Recalculate KPIs
        return updatedAds;
      });
      setRealtimeEvents((prev) => [
        { type: 'Ad Update', data: advertisement, time: new Date() },
        ...prev.slice(0, 19),
      ]);
    });
    newConnection.on('ReceiveClickTimestamp', (timestamp) => {
      console.log('Received Click Timestamp:', timestamp);
      setClickTimeStamps((prev) => [...prev, timestamp]);
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
      setViewTimeStamps((prev) => [...prev, timestamp]);
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
      setConversionTimeStamps((prev) => [...prev, timestamp]);
      setRealtimeEvents((prev) => [
        {
          type: 'Conversion',
          data: new Date(timestamp).toLocaleTimeString(),
          time: new Date(),
        },
        ...prev.slice(0, 19),
      ]);
    });
    newConnection.onclose((error) => {
      console.warn('SignalR connection closed.', error);
      setConnectionStatus('Disconnected');
      if (error) setLastError(`Connection closed: ${error.message}`);
    });
    newConnection.onreconnecting((error) => {
      console.warn('SignalR attempting to reconnect...', error);
      setConnectionStatus('Reconnecting...');
      setLastError(error ? `Reconnect failed: ${error.message}` : '');
    });
    newConnection.onreconnected((connectionId) => {
      console.log('SignalR reconnected with ID:', connectionId);
      setConnectionStatus('Connected');
      setLastError('');
    });
    return () => {
      if (
        connectionRef.current &&
        connectionRef.current.state === 'Connected'
      ) {
        console.log('Stopping SignalR connection.');
        connectionRef.current
          .stop()
          .catch((err) => console.error('Error stopping SignalR:', err));
      }
    };
  }, []); // Run once

  // --- Initial Data Fetch (combining logic from both branches) ---
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Fetch stores first to get products
      const stores = await apiGetAllStoresAsync();
      let allFetchedProducts = [];
      let productsThisMonthCount = 0;
      let productsPrevMonthCount = 0;
      const now = new Date();
      const lastMonthDate = subMonths(now, 1);
      const prevMonthDate = subMonths(now, 2);

      if (stores && stores.length > 0) {
        const productPromises = stores.map((store) =>
          store && store.id
            ? apiGetStoreProductsAsync(store.id)
            : Promise.resolve({ data: [] })
        );
        const productResults = await Promise.all(productPromises);
        productResults.forEach((result) => {
          if (result && result.data && Array.isArray(result.data)) {
            allFetchedProducts.push(...result.data);
            result.data.forEach((p) => {
              const createdAt = p.createdAt
                ? parseISO(p.createdAt)
                : new Date(0);
              if (createdAt >= lastMonthDate) productsThisMonthCount++;
              if (createdAt >= prevMonthDate && createdAt < lastMonthDate)
                productsPrevMonthCount++;
            });
          }
        });
      }
      setProducts(allFetchedProducts); // For product pagination

      const calculatedProductsChange =
        productsPrevMonthCount > 0
          ? ((productsThisMonthCount - productsPrevMonthCount) /
              productsPrevMonthCount) *
            100
          : productsThisMonthCount > 0
            ? 100
            : 0;

      // Fetch ads for general KPIs (from develop)
      const adsResponse = await apiGetAllAdsAsync();
      const initialAdsData =
        adsResponse && adsResponse.data && Array.isArray(adsResponse.data)
          ? adsResponse.data
          : [];
      console.log('Initial Ads Data:', initialAdsData);
      setAds(initialAdsData);

      // Fetch ads with profit for ProductsSummary (from HEAD)
      const adsWithProfitResponse = await apiFetchAdsWithProfitAsync();
      const adsForSummaryData =
        adsWithProfitResponse && Array.isArray(adsWithProfitResponse)
          ? adsWithProfitResponse
          : adsWithProfitResponse && Array.isArray(adsWithProfitResponse.data)
            ? adsWithProfitResponse.data
            : [];
      console.log('✅ Fetched ads with profit for summary:', adsForSummaryData);
      setAdsDataForSummary(adsForSummaryData);

      // Calculate KPIs with fetched data
      // Pass allFetchedProducts.length for totalProductsCount
      // Pass calculatedProductsChange for productsChange KPI
      calculateKpis(
        initialAdsData,
        allFetchedProducts.length,
        calculatedProductsChange
      );

      // Other initial data if needed (orders, users - not directly used for KPIs in develop's version)
      // const ordersData = await apiFetchOrdersAsync();
      // const usersResponse = await apiFetchAllUsersAsync();
      // const users = usersResponse.data;
    } catch (error) {
      console.error('Error fetching initial data:', error);
      // Set error states or default values if needed
    }
  };

  // --- KPI Calculation (from develop, adapted) ---
  const calculateKpis = (
    currentAdsData,
    totalProductsCount,
    productsChangeValue = kpi.productsChange
  ) => {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = subMonths(currentMonthStart, 1); // Correctly get first day of previous month
    const previousMonthEnd = subMonths(now, 1); // End of previous month is last day of previous month
    previousMonthEnd.setDate(0); // Set to last day of previous month. Example: if now is July 10, this becomes June 30.
    // More robust way: const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const adsThisMonth = currentAdsData.filter((ad) => {
      const startTime = ad.startTime ? parseISO(ad.startTime) : new Date(0);
      return startTime >= currentMonthStart && startTime <= now;
    });
    const adsPrevMonth = currentAdsData.filter((ad) => {
      const startTime = ad.startTime ? parseISO(ad.startTime) : new Date(0);
      return startTime >= previousMonthStart && startTime <= previousMonthEnd;
    });

    const calculateMetricAndChange = (metricExtractor, priceField = null) => {
      const currentMonthTotal = adsThisMonth.reduce(
        (sum, ad) =>
          sum +
          (priceField
            ? (ad[metricExtractor] || 0) * (ad[priceField] || 0)
            : ad[metricExtractor] || 0),
        0
      );
      const prevMonthTotal = adsPrevMonth.reduce(
        (sum, ad) =>
          sum +
          (priceField
            ? (ad[metricExtractor] || 0) * (ad[priceField] || 0)
            : ad[metricExtractor] || 0),
        0
      );
      const change =
        prevMonthTotal > 0
          ? ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100
          : currentMonthTotal > 0
            ? 100
            : 0;
      return { total: currentMonthTotal, change };
    };

    const viewsStats = calculateMetricAndChange('views');
    const clicksStats = calculateMetricAndChange('clicks');
    const conversionsStats = calculateMetricAndChange('conversions');
    const conversionRevenueStats = calculateMetricAndChange(
      'conversions',
      'conversionPrice'
    ); // Assuming conversionPrice is per conversion
    const clicksRevenueStats = calculateMetricAndChange('clicks', 'clickPrice');
    const viewsRevenueStats = calculateMetricAndChange('views', 'viewPrice');

    const totalAdsChange =
      adsPrevMonth.length > 0
        ? ((adsThisMonth.length - adsPrevMonth.length) / adsPrevMonth.length) *
          100
        : adsThisMonth.length > 0
          ? 100
          : 0;

    const activeAds = currentAdsData.filter((ad) => ad.isActive).length;
    const topAds = [...currentAdsData]
      .sort(
        (a, b) =>
          (b.conversions || 0) * (b.conversionPrice || 0) -
          (a.conversions || 0) * (a.conversionPrice || 0)
      ) // Sort by total conversion revenue
      .slice(0, 5);

    setKpi({
      totalViews: viewsStats.total,
      totalClicks: clicksStats.total,
      totalConversions: conversionsStats.total,
      totalConversionRevenue: conversionRevenueStats.total.toFixed(2),
      totalAds: currentAdsData.length,
      activeAds: activeAds,
      topAds: topAds,
      totalClicksRevenue: clicksRevenueStats.total.toFixed(2),
      totalViewsRevenue: viewsRevenueStats.total.toFixed(2),
      totalProducts: totalProductsCount,
      viewsChange: viewsStats.change.toFixed(2),
      clicksChange: clicksStats.change.toFixed(2),
      conversionsChange: conversionsStats.change.toFixed(2),
      conversionRevenueChange: conversionRevenueStats.change.toFixed(2),
      clicksRevenueChange: clicksRevenueStats.change.toFixed(2),
      viewsRevenueChange: viewsRevenueStats.change.toFixed(2),
      productsChange: productsChangeValue.toFixed(2),
      totalAdsChange: totalAdsChange.toFixed(2),
    });
  };

  // RealtimeEventsList component (from develop, optional to render)
  const RealtimeEventsList = () => (
    <Box
      sx={{
        bgcolor: 'background.paper',
        p: 2,
        borderRadius: 1,
        boxShadow: 1,
        maxHeight: 300,
        overflowY: 'auto',
        mt: 2,
      }}
    >
      <Typography variant='h6' sx={{ mb: 1, fontWeight: 'bold' }}>
        Realtime Events ({connectionStatus})
      </Typography>
      {lastError && (
        <Typography color='error' variant='caption'>
          Last Error: {lastError}
        </Typography>
      )}
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
            {/* <Typography variant='caption' color='text.secondary' sx={{display: 'block'}}>{JSON.stringify(event.data)}</Typography> */}
          </Box>
        ))
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        pl: { xs: 2, md: 42 }, // Responsive padding
        pr: { xs: 2, md: 4 }, // Responsive padding
        pt: 4,
        pb: 8,
        height: '100vh',
        overflowY: 'auto',
        '&::-webkit-scrollbar': { width: 8 },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(15, 118, 110, 0.6)',
          borderRadius: 4,
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: 'rgba(15, 118, 110, 0.8)',
        },
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
            color:
              connectionStatus === 'Connected'
                ? 'green'
                : connectionStatus === 'Connecting...' ||
                    connectionStatus === 'Reconnecting...'
                  ? 'orange'
                  : 'red',
          }}
        >
          ({connectionStatus})
        </span>
      </Typography>

      {/* KPI sekcija (from develop) */}
      <Grid container spacing={2} mb={3} sx={{ maxWidth: 1200 }}>
        {' '}
        {/* Adjusted spacing and maxWidth */}
        {[
          {
            label: 'Total Ads',
            value: kpi.totalAds,
            change: kpi.totalAdsChange,
            type: 'totalAds',
          },
          {
            label: 'Total Views',
            value: kpi.totalViews,
            change: kpi.viewsChange,
            type: 'views',
          },
          {
            label: 'Total Clicks',
            value: kpi.totalClicks,
            change: kpi.clicksChange,
            type: 'clicks',
          },
          {
            label: 'Total Conversions',
            value: kpi.totalConversions,
            change: kpi.conversionsChange,
            type: 'conversions',
          }, // Changed type
          {
            label: 'Conversion Revenue',
            value: kpi.totalConversionRevenue,
            change: kpi.conversionRevenueChange,
            type: 'conversionRevenue',
          },
          {
            label: 'Clicks Revenue',
            value: kpi.totalClicksRevenue,
            change: kpi.clicksRevenueChange,
            type: 'clicksRevenue',
          }, // Changed type
          {
            label: 'Views Revenue',
            value: kpi.totalViewsRevenue,
            change: kpi.viewsRevenueChange,
            type: 'viewsRevenue',
          }, // Changed type
          {
            label: 'Total Products',
            value: kpi.totalProducts,
            change: kpi.productsChange,
            type: 'products',
          }, // Changed type
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={3} lg={1.5} key={i}>
            {' '}
            {/* Responsive grid items for KPIs */}
            <KpiCard
              label={item.label}
              value={item.value}
              percentageChange={item.change}
              type={item.type}
            />
          </Grid>
        ))}
      </Grid>

      {/* Glavni graf + countries */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={9}>
          <Box sx={{ height: 420, width: '100%' }}>
            {' '}
            {/* Responsive width */}
            <AnalyticsChart />
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ height: 420, width: '100%' }}>
            {' '}
            {/* Responsive width */}
            <CountryStatsPanel />
            {/* You might want to place RealtimeEventsList here or elsewhere */}
            {/* <RealtimeEventsList /> */}
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ width: '100%', mt: 4 }}>
        {' '}
        {/* Responsive width */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            {' '}
            {/* Responsive width */}
            <Box sx={{ height: 340, display: 'flex', flexDirection: 'column' }}>
              <OrdersByStatus />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            {' '}
            {/* Responsive width */}
            <Box sx={{ height: 340, display: 'flex', flexDirection: 'column' }}>
              <UserDistribution />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            {' '}
            {/* Responsive width */}
            <Box sx={{ height: 340, display: 'flex', flexDirection: 'column' }}>
              <RevenueByStore />
            </Box>
          </Grid>
        </Grid>
        {/* Charts from develop */}
        <Box sx={{ width: '100%', mt: 4 }}>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <AdFunnelChart />
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <ParetoChart />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <AdStackedBarChart />
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Calendar />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <DealsChart />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <SalesChart />
              </Box>
            </Grid>
            <Grid item xs={12} md={12}>
              {' '}
              {/* Added a spot for RealtimeEventsList */}
              <RealtimeEventsList />
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Product List with Pagination (from HEAD) */}
      <Box sx={{ width: '100%', mt: 6 }} id='products-section'>
        {' '}
        {/* Responsive width */}
        <Typography variant='h5' sx={{ mb: 2, color: 'primary.dark' }}>
          Product Performance
        </Typography>
        {products.length === 0 && (
          <Typography sx={{ textAlign: 'center', my: 4 }}>
            No products to display or still loading...
          </Typography>
        )}
        {paginatedProducts.map((product, i) => (
          <Grid
            container
            spacing={2}
            key={
              product.id ||
              `prod-summary-${(currentProductPage - 1) * PRODUCTS_PER_PAGE + i}`
            }
            sx={{ mb: 2 }}
          >
            <Grid item xs={12} md={6}>
              {/* Ensure adsDataForSummary is correctly populated and passed */}
              <ProductsSummary product={product} ads={adsDataForSummary} />
            </Grid>
          </Grid>
        ))}
        {pageCount > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, pb: 4 }}>
            <Pagination
              count={pageCount}
              page={currentProductPage}
              onChange={handlePageChange}
              color='primary'
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Box>
      <Box sx={{ width: '100%', mt: 6 }} id='revenue-section'>
        {/* //jel ovo ima smisla ovd? (Comment from HEAD)
                  // If RevenueMetrics is global, it should be outside this map.
                  // If it's per-product, it should receive 'product' as a prop. */}
        <RevenueMetrics /> {/* Assuming it might be per product */}
      </Box>
    </Box>
  );
};

export default AnalyticsPage;
