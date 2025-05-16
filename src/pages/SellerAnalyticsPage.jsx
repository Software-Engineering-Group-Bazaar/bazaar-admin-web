import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
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
import { DollarSign, TrendingUp, BarChart2, Store } from 'lucide-react';

// mock data (will be used if props don't provide enough data for calculation)
const mockStats = [
  {
    month: 'Jan',
    earningsFromClicks: 80,
    earningsFromViews: 20,
    earningsFromConversions: 100000,
  },
  {
    month: 'Feb',
    earningsFromClicks: 90,
    earningsFromViews: 25,
    earningsFromConversions: 105,
  },
  {
    month: 'Mar',
    earningsFromClicks: 110,
    earningsFromViews: 30,
    earningsFromConversions: 120,
  },
  {
    month: 'Apr',
    earningsFromClicks: 130,
    earningsFromViews: 40,
    earningsFromConversions: 150,
  },
  {
    month: 'May',
    earningsFromClicks: 145,
    earningsFromViews: 50,
    earningsFromConversions: 160,
  },
  {
    month: 'Jun',
    earningsFromClicks: 160,
    earningsFromViews: 60,
    earningsFromConversions: 175,
  },
];
const mockRealtimeStats = {
  sellerName: 'N/A (Using Mock)',
  earningsFromClicks: 106.0,
  earningsFromClicksOverTime: [10, 20, 30, 46, 55, 63],
  earningsFromViews: 33.6,
  earningsFromViewsOverTime: [5, 8, 10, 10.6, 12, 14],
  earningsFromConversions: 220.0,
  earningsFromConversionsOverTime: [40, 60, 50, 70, 85, 100000],
  totalEarnings: 359.6,
  sellerProfit: 287.68,
};

const iconMap = {
  'Total Earnings': <DollarSign size={20} />,
  'Seller Profit': <TrendingUp size={20} />,
  'View Revenue': <BarChart2 size={20} />, // Note: Duplicate key with 'Conversion Revenue', consider unique keys if icons differ
  'Conversion Revenue': <BarChart2 size={20} />,
  // Added for Click Revenue to avoid undefined icon
  'Click Revenue': <BarChart2 size={20} />,
};

const storeToStats = (store, ads, clickData, viewData, conversionData) => {
  if (!store || !ads || !clickData || !viewData || !conversionData)
    return mockStats; // Fallback
  const monthlyAggregatedStats = {};

  const getMonthStats = (monthKey) => {
    if (!monthlyAggregatedStats[monthKey]) {
      monthlyAggregatedStats[monthKey] = {
        earningsFromClicks: 0,
        earningsFromViews: 0,
        earningsFromConversions: 0,
      };
    }
    return monthlyAggregatedStats[monthKey];
  };

  clickData.forEach((entry) => {
    const ad = ads.find((a) => a.id === entry.id);
    if (!ad || typeof ad.clickPrice !== 'number') return;
    (entry.clicks || []).forEach((clickTimestamp) => {
      const timestamp = new Date(clickTimestamp);
      const start = new Date(ad.startTime);
      const end = new Date(ad.endTime);
      if (timestamp >= start && timestamp <= end) {
        const monthKey = `${timestamp.getUTCFullYear()}-${String(timestamp.getUTCMonth() + 1).padStart(2, '0')}`;
        const stats = getMonthStats(monthKey);
        stats.earningsFromClicks += ad.clickPrice;
      }
    });
  });

  viewData.forEach((entry) => {
    const ad = ads.find((a) => a.id === entry.id);
    if (!ad || typeof ad.viewPrice !== 'number') return;
    (entry.views || []).forEach((viewTimestamp) => {
      const timestamp = new Date(viewTimestamp);
      const start = new Date(ad.startTime);
      const end = new Date(ad.endTime);
      if (timestamp >= start && timestamp <= end) {
        const monthKey = `${timestamp.getUTCFullYear()}-${String(timestamp.getUTCMonth() + 1).padStart(2, '0')}`;
        const stats = getMonthStats(monthKey);
        stats.earningsFromViews += ad.viewPrice;
      }
    });
  });

  conversionData.forEach((entry) => {
    const ad = ads.find((a) => a.id === entry.id);
    if (!ad || typeof ad.conversionPrice !== 'number') return;
    (entry.conversions || []).forEach((conversionTimestamp) => {
      const timestamp = new Date(conversionTimestamp);
      const start = new Date(ad.startTime);
      const end = new Date(ad.endTime);
      if (timestamp >= start && timestamp <= end) {
        const monthKey = `${timestamp.getUTCFullYear()}-${String(timestamp.getUTCMonth() + 1).padStart(2, '0')}`;
        const stats = getMonthStats(monthKey);
        stats.earningsFromConversions += ad.conversionPrice;
      }
    });
  });

  const result = [];
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const sortedMonthKeys = Object.keys(monthlyAggregatedStats).sort();

  if (sortedMonthKeys.length === 0) return mockStats; // Fallback if no data processed

  sortedMonthKeys.forEach((monthKey) => {
    const [year, monthNumStr] = monthKey.split('-');
    const monthIndex = parseInt(monthNumStr, 10) - 1;
    const monthName = monthNames[monthIndex];
    result.push({
      month: monthName,
      earningsFromClicks: parseFloat(
        monthlyAggregatedStats[monthKey].earningsFromClicks.toFixed(2)
      ),
      earningsFromViews: parseFloat(
        monthlyAggregatedStats[monthKey].earningsFromViews.toFixed(2)
      ),
      earningsFromConversions: parseFloat(
        monthlyAggregatedStats[monthKey].earningsFromConversions.toFixed(2)
      ),
    });
  });
  return result; // Ensure we don't return empty if processing happened but yielded no months
};

const storeToSummary = (store, ads, products, clicks, views, conversions) => {
  if (!store || !ads || !products || !clicks || !views || !conversions)
    return {
      sellerName: 'N/A (Using default)',
      earningsFromClicks: 0.0,
      earningsFromClicksOverTime: [0],
      earningsFromViews: 0,
      earningsFromViewsOverTime: [0],
      earningsFromConversions: 0,
      earningsFromConversionsOverTime: [0],
      totalEarnings: 0,
      sellerProfit: 0,
    }; // Fallback

  // Calculate revenues based on ad properties (assuming these are aggregated counts on ad objects)
  const clickrev = ads.reduce(
    (acc, ad) => acc + (ad.clicks || 0) * (ad.clickPrice || 0),
    0
  );
  const convrev = ads.reduce(
    (acc, ad) => acc + (ad.conversions || 0) * (ad.conversionPrice || 0),
    0
  );
  const viewrev = ads.reduce(
    (acc, ad) => acc + (ad.views || 0) * (ad.viewPrice || 0),
    0
  );

  const sellerrev = ads.reduce((acc, ad) => {
    if (!ad.adData || !ad.adData[0] || !ad.adData[0].productId) return acc;
    const product = products.find((p) => p.id === ad.adData[0].productId);
    return acc + (ad.conversions || 0) * (product ? product.retailPrice : 0);
  }, 0);

  // Process detailed click/view/conversion data for "OverTime" arrays
  // These expect `clicks`, `views`, `conversions` to be arrays of { id: adId, clicks/views/conversions: [timestamps] }
  // The .fill() part is tricky; it replaces timestamps with prices. If the goal is a list of earnings per event:
  const c_processed = clicks
    .map((adDetail) => {
      const adConfig = ads.find((ad) => ad.id === adDetail.id);
      if (!adConfig) return [];
      return (adDetail.clicks || []).map(() => adConfig.clickPrice); // Array of prices, one for each click
    })
    .flat();

  const v_processed = views
    .map((adDetail) => {
      const adConfig = ads.find((ad) => ad.id === adDetail.id);
      if (!adConfig) return [];
      return (adDetail.views || []).map(() => adConfig.viewPrice);
    })
    .flat();

  const cc_processed = conversions
    .map((adDetail) => {
      const adConfig = ads.find((ad) => ad.id === adDetail.id);
      if (!adConfig) return [];
      return (adDetail.conversions || []).map(() => adConfig.conversionPrice);
    })
    .flat();

  const totalEarnings = convrev + viewrev + clickrev;
  const sellerProfit = sellerrev - totalEarnings;

  return {
    sellerName: store.name || 'Unknown Store',
    earningsFromClicks: parseFloat(clickrev.toFixed(2)),
    earningsFromClicksOverTime: c_processed.length > 0 ? c_processed : [0],

    earningsFromViews: parseFloat(viewrev.toFixed(2)),
    earningsFromViewsOverTime: v_processed.length > 0 ? v_processed : [0],
    earningsFromConversions: parseFloat(convrev.toFixed(2)),
    earningsFromConversionsOverTime:
      cc_processed.length > 0 ? cc_processed : [0],
    totalEarnings: parseFloat(totalEarnings.toFixed(2)),
    sellerProfit: parseFloat(sellerProfit.toFixed(2)),
  };
};

const SellerAnalytics = ({
  store,
  ads,
  products,
  allClicks, // Expected: [{ id: adId, clicks: [timestamp1, ...] }, ...]
  allViews, // Expected: [{ id: adId, views: [timestamp1, ...] }, ...]
  allConversions, // Expected: [{ id: adId, conversions: [timestamp1, ...] }, ...]
}) => {
  const [stats, setStats] = useState(mockStats);
  const [summary, setSummary] = useState(mockRealtimeStats);

  useEffect(() => {
    // console.log("SellerAnalytics useEffect triggered. Store:", store);
    // console.log("Ads for store:", ads);
    // console.log("Products for store:", products);
    // console.log("AllClicks for store:", allClicks);

    if (store && ads && products && allClicks && allViews && allConversions) {
      const calculatedStats = storeToStats(
        store,
        ads,
        allClicks,
        allViews,
        allConversions
      );
      const calculatedSummary = storeToSummary(
        store,
        ads,
        products,
        allClicks,
        allViews,
        allConversions
      );

      // console.log("Calculated Stats:", calculatedStats);
      // console.log("Calculated Summary:", calculatedSummary);

      setStats(calculatedStats);
      setSummary(calculatedSummary);
      console.log(store);
    } else {
      console.log('SellerAnalytics: Missing some props, using mock data.');
      // Fallback to ensure summary always has a sellerName if store is somehow undefined briefly
      setSummary((prev) => ({
        ...mockRealtimeStats,
        sellerName: store?.name || mockRealtimeStats.sellerName,
      }));
      setStats(mockStats);
    }
  }, [store, ads, products, allClicks, allViews, allConversions]);

  const topStats = [
    {
      label: 'Total Earnings',
      value: `${summary.totalEarnings.toFixed(2)} €`,
      change: -5.2,
    }, // Change data is static for now
    {
      label: 'Seller Profit',
      value: `${summary.sellerProfit.toFixed(2)} €`,
      change: 2.1,
    },
    {
      label: 'Click Revenue',
      value: `${summary.earningsFromClicks.toFixed(2)} €`,
      change: 1.5,
    }, // Added Click Revenue
    {
      label: 'View Revenue',
      value: `${summary.earningsFromViews.toFixed(2)} €`,
      change: -3.6,
    },
    {
      label: 'Conversion Revenue',
      value: `${summary.earningsFromConversions.toFixed(2)} €`,
      change: 4.9,
    },
  ];

  return (
    <Box
      sx={{
        px: { xs: 1, md: 3 },
        pt: 4,
        pb: 6,
        width: '1170px',
        bgcolor: '#f5f7fa',
        minHeight: 'auto',
        border: '1px solid #e0e0e0',
        borderRadius: 2,
      }}
    >
      <Typography variant='h5' fontWeight={700} mb={1} color='primary.dark'>
        Store Performance: {summary.sellerName}
      </Typography>
      <Box display='flex' alignItems='center' mb={4} gap={1}>
        <Store size={20} color='#0f766e' />
        <Typography variant='subtitle1' fontWeight={600} color='text.secondary'>
          Detailed Analytics for {summary.sellerName}
        </Typography>
      </Box>

      <Grid container spacing={3} mb={3} justifyContent='center'>
        {' '}
        {/* Adjusted spacing */}
        {topStats.map((item, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={idx}>
            {' '}
            {/* More responsive grid items */}
            <Card
              sx={{
                backgroundColor: '#fff',
                borderRadius: 3,
                boxShadow: 2,
                width: '200px',
                height: '100%',
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  p: '16px !important',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ fontSize: '0.8rem' }}
                  >
                    {item.label}
                  </Typography>
                  <Box sx={{ color: 'primary.main' }}>
                    {iconMap[item.label] || <BarChart2 size={20} />}
                  </Box>
                </Box>
                <Typography variant='h6' fontWeight={700}>
                  {' '}
                  {/* Adjusted font size */}
                  {item.value}
                </Typography>
                {item.change !== undefined && (
                  <Typography
                    variant='caption'
                    sx={{
                      color: item.change < 0 ? 'error.main' : 'success.main',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    {/* {item.change < 0 ? '↓' : '↑'}{' '}
                    {Math.abs(item.change).toFixed(1)}% vs last month */}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} justifyContent='center' sx={{ maxWidth: 1170 }}>
        {' '}
        {/* Adjusted spacing */}
        {[
          {
            title: 'Click Revenue Over Time',
            color: '#0f766e',
            data: summary.earningsFromClicksOverTime,
          },
          {
            title: 'View Revenue Over Time',
            color: '#f59e0b',
            data: summary.earningsFromViewsOverTime,
          },
          {
            title: 'Conversion Revenue Over Time',
            color: '#ef4444',
            data: summary.earningsFromConversionsOverTime,
          },
        ].map((graph, idx) => (
          <Grid item xs={12} md={6} lg={4} key={idx}>
            {' '}
            {/* Responsive charts */}
            <Card
              sx={{
                backgroundColor: '#fff',
                borderRadius: 3,
                boxShadow: 2,
                p: 2,
                width: '350px',
              }}
            >
              <Typography variant='subtitle1' fontWeight={600} mb={2}>
                {' '}
                {/* Adjusted font size */}
                {graph.title}
              </Typography>
              <ResponsiveContainer width='100%' height={250}>
                {' '}
                {/* Adjusted height */}
                <LineChart
                  data={(stats || mockStats)
                    .slice(-Math.min(5, (stats || mockStats).length))
                    .map((s, i) => ({
                      // Ensure stats is not null and handle slice if fewer than 5 data points
                      month: s.month,
                      // Ensure graph.data is an array and access it safely
                      value:
                        Array.isArray(graph.data) && graph.data.length > i
                          ? graph.data.slice(-Math.min(5, graph.data.length))[i]
                          : 0,
                    }))}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='month' fontSize='0.75rem' />
                  <YAxis fontSize='0.75rem' />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                  <Line
                    type='monotone'
                    dataKey='value'
                    stroke={graph.color}
                    strokeWidth={2}
                    name={`${graph.title.split(' ')[0]} (€)`}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SellerAnalytics;
