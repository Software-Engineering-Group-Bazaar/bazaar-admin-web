import React, { useEffect, useState } from 'react';
import { Card, Typography, Box, Grid } from '@mui/material';
import FunnelCurved from './FunnelCurved';
import {
  VisibilityOutlined,
  MouseOutlined,
  CheckCircleOutline,
} from '@mui/icons-material';
import { apiGetAllAdsAsync } from '../api/api.js';

const funnelColors = ['#60a5fa', '#38bdf8', '#0ea5e9'];

const funnelIcons = [
  <VisibilityOutlined fontSize="large" />,
  <MouseOutlined fontSize="large" />,
  <CheckCircleOutline fontSize="large" />,
];

export default function AdFunnelChart() {
  const [funnelSteps, setFunnelSteps] = useState([
    { label: 'Viewed', value: 0, percent: 100, color: funnelColors[0], icon: funnelIcons[0] },
    { label: 'Clicked', value: 0, percent: 0, color: funnelColors[1], icon: funnelIcons[1] },
    { label: 'Converted', value: 0, percent: 0, color: funnelColors[2], icon: funnelIcons[2] },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const adsResponse = await apiGetAllAdsAsync();
      const ads = adsResponse.data;
      const totalViews = ads.reduce((sum, ad) => sum + (ad.views || 0), 0);
      const totalClicks = ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
      const totalConversions = ads.reduce((sum, ad) => sum + (ad.conversions || 0), 0);

      setFunnelSteps([
        {
          label: 'Viewed',
          value: totalViews,
          percent: 100,
          color: funnelColors[0],
          icon: funnelIcons[0],
        },
        {
          label: 'Clicked',
          value: totalClicks,
          percent: totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0,
          color: funnelColors[1],
          icon: funnelIcons[1],
        },
        {
          label: 'Converted',
          value: totalConversions,
          percent: totalClicks > 0 ? Math.round((totalConversions / totalClicks) * 100) : 0,
          color: funnelColors[2],
          icon: funnelIcons[2],
        },
      ]);
    };

    fetchData();
  }, []);

  // Statistika za gornji dio (možeš prilagoditi)
  const stats = [
    {
      label: 'Total Views',
      value: funnelSteps[0].value.toLocaleString(),
      change: '',
      sub: '',
      bgColor: '#e0f7fa',
    },
    {
      label: 'Total Clicks',
      value: funnelSteps[1].value.toLocaleString(),
      change: '',
      sub: '',
      bgColor: '#e8f5e9',
    },
    {
      label: 'Total Conversions',
      value: funnelSteps[2].value.toLocaleString(),
      change: '',
      sub: '',
      bgColor: '#fce4ec',
    },
  ];

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: 3,
        width: 1190,
        margin: '2rem auto',
        background: '#fff',
      }}
    >
      <Typography variant='h5' fontWeight={700} mb={3} textAlign='center'>
        Sales Funnel Analysis
      </Typography>

      {/* Gornja Sekcija */}
      <Grid container spacing={3} mb={4} justifyContent='center'>
        {stats.map((stat) => (
          <Grid item xs={12} md={4} key={stat.label}>
            <Box
              sx={{
                backgroundColor: stat.bgColor,
                borderRadius: 4,
                p: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant='subtitle2' color='text.secondary'>
                {stat.label}
              </Typography>
              <Typography variant='h4' fontWeight={700} color='text.primary'>
                {stat.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Funnel Grafa */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 2,
        }}
      >
        <FunnelCurved steps={funnelSteps} width={600} height={160} />
      </Box>

      {/* Donja Sekcija sa Karticama */}
      <Grid container spacing={2} sx={{ px: 2, mt: 2 }}>
        {funnelSteps.map((step) => (
          <Grid item xs={12} sm={4} key={step.label} sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                borderRadius: 8,
                p: 2,
                backgroundColor: '#f8f9fa',
                textAlign: 'center',
                boxShadow: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                minHeight: 120,
              }}
            >
              <Box sx={{ mb: 1, color: step.color, fontSize: 36 }}>
                {step.icon}
              </Box>
              <Typography variant='h5' fontWeight={700} color='#3a0c02'>
                {step.value.toLocaleString()}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {step.label}
              </Typography>
              <Typography variant='caption' color='primary' fontWeight={600}>
                {step.percent}% from previous
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
}
