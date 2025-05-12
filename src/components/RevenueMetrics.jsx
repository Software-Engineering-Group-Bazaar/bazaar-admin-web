import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { DollarSign, Eye, MousePointerClick, ShoppingCart } from 'lucide-react';
import MetricCard from './MetricCard';
import { apiFetchAdsWithProfitAsync } from '@api/api';

const formatCurrency = (value, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);

const groupByDay = (ads, eventType) => {
  const days = Array(30).fill(0);
  const today = new Date();

  ads.forEach((ad) => {
    const eventCount = ad[eventType];
    const price = ad[`${eventType.slice(0, -1)}Price`];

    const date = new Date(ad.startTime);
    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < 30) {
      days[29 - diffDays] += eventCount * price;
    }
  });

  return days;
};

const RevenueMetrics = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const adsData = await apiFetchAdsWithProfitAsync();
      setAds(adsData);
    };
    fetchData();
  }, []);

  const totalRevenue = ads.reduce(
    (acc, ad) =>
      acc +
      ad.clicks * ad.clickPrice +
      ad.views * ad.viewPrice +
      ad.conversions * ad.conversionPrice,
    0
  );

  const clickRevenue = ads.reduce(
    (sum, ad) => sum + ad.clicks * ad.clickPrice,
    0
  );
  const viewRevenue = ads.reduce((sum, ad) => sum + ad.views * ad.viewPrice, 0);
  const conversionRevenue = ads.reduce(
    (sum, ad) => sum + ad.conversions * ad.conversionPrice,
    0
  );

  const revenueBySource = [
    { id: 0, value: clickRevenue, label: 'Click Revenue', color: '#3B82F6' },
    { id: 1, value: viewRevenue, label: 'View Revenue', color: '#0D9488' },
    {
      id: 2,
      value: conversionRevenue,
      label: 'Conversion Revenue',
      color: '#10B981',
    },
  ];

  const clickRevenueByDay = groupByDay(ads, 'clicks');
  const viewRevenueByDay = groupByDay(ads, 'views');
  const conversionRevenueByDay = groupByDay(ads, 'conversions');

  const dateLabels = Array(30)
    .fill()
    .map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

  const xAxisLabels = dateLabels.map((label, i) => (i % 5 === 0 ? label : ''));

  return (
    <Box sx={{ maxWidth: 1200, ml: '5', mb: 4 }}>
      <Typography variant='h5' sx={{ mb: 3 }}>
        Revenue & Profit Analysis
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title='Total Revenue'
            value={formatCurrency(totalRevenue)}
            subtitle='From all advertising sources'
            icon={<DollarSign size={20} />}
            color='success'
            tooltipText='Total revenue generated from all sources'
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title='Click Revenue'
            value={formatCurrency(clickRevenue)}
            subtitle={`From ${ads.reduce((s, a) => s + a.clicks, 0).toLocaleString()} clicks`}
            icon={<MousePointerClick size={20} />}
            color='info'
            tooltipText='Revenue from ad clicks'
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title='View Revenue'
            value={formatCurrency(viewRevenue)}
            subtitle={`From ${ads.reduce((s, a) => s + a.views, 0).toLocaleString()} views`}
            icon={<Eye size={20} />}
            color='secondary'
            tooltipText='Revenue from ad views'
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title='Conversion Revenue'
            value={formatCurrency(conversionRevenue)}
            subtitle={`From ${ads.reduce((s, a) => s + a.conversions, 0).toLocaleString()} conversions`}
            icon={<ShoppingCart size={20} />}
            color='success'
            tooltipText='Revenue from conversions'
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%', width: '665px' }}>
            <Typography variant='h6' sx={{ mb: 2 }}>
              Revenue by Source Over Time
            </Typography>
            <LineChart
              series={[
                {
                  data: clickRevenueByDay,
                  label: 'Click Revenue',
                  color: '#3B82F6',
                  showMark: false,
                },
                {
                  data: viewRevenueByDay,
                  label: 'View Revenue',
                  color: '#0D9488',
                  showMark: false,
                },
                {
                  data: conversionRevenueByDay,
                  label: 'Conversion Revenue',
                  color: '#10B981',
                  showMark: false,
                },
              ]}
              xAxis={[
                {
                  data: dateLabels,
                  scaleType: 'point',
                  tickLabelStyle: {
                    angle: 0,
                    textAnchor: 'middle',
                    fontSize: 12,
                  },
                  tickSize: 0,
                  tickValues: xAxisLabels,
                },
              ]}
              height={300}
              margin={{ top: 20, bottom: 30, left: 40, right: 20 }}
              sx={{
                '.MuiLineElement-root': {
                  strokeWidth: 2,
                },
                '.MuiMarkElement-root': {
                  stroke: 'white',
                  strokeWidth: 2,
                  r: 4,
                },
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant='h6' sx={{ mb: 2 }}>
              Revenue Distribution
            </Typography>
            <Box
              sx={{
                height: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PieChart
                series={[
                  {
                    data: revenueBySource,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: 'gray',
                    },
                    innerRadius: 60,
                    outerRadius: 110,
                    paddingAngle: 1,
                    cornerRadius: 4,
                  },
                ]}
                height={280}
                width={280}
                margin={{ top: 10, bottom: 10 }}
                legend={{ hidden: false }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RevenueMetrics;
