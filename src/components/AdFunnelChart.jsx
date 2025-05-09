import React from 'react';
import { Card, Typography, Box, Grid } from '@mui/material';
import FunnelCurved from './FunnelCurved';

const funnelSteps = [
    { label: 'Viewed', value: 6800, percent: 100, color: '#60a5fa' },
    { label: 'Clicked', value: 5750, percent: 85, color: '#38bdf8' },
    { label: 'Add to Cart', value: 4500, percent: 66, color: '#0ea5e9' },
    { label: 'Checkout', value: 3400, percent: 50, color: '#0369a1' },
    { label: 'Purchased', value: 1200, percent: 18, color: '#0a2540' },
  ];
  

const stats = [
  {
    label: 'Weekly',
    value: '$3,113',
    change: '+10.3%',
    sub: 'Compared to $1,110 last week',
    color: 'success.main',
  },
  {
    label: 'Monthly',
    value: '$9,243',
    change: '+3.7%',
    sub: 'Compared to $6,453 last month',
    color: 'success.main',
  },
  {
    label: 'Yearly',
    value: '$99,898',
    change: '+18.3%',
    sub: 'Compared to $79,098 last year',
    color: 'success.main',
  },
];

export default function AdFunnelChart() {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: 3,
        maxWidth: 700,
        margin: '2rem auto',
        background: '#fff',
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={2}>
        Sales Funnel Analysis
      </Typography>
      <Grid container spacing={2} mb={2}>
        {stats.map((stat) => (
          <Grid item xs={12} md={4} key={stat.label}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {stat.label}
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {stat.value}
                <Typography
                  component="span"
                  variant="body2"
                  color={stat.color}
                  sx={{ ml: 1 }}
                >
                  {stat.change}
                </Typography>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stat.sub}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 2,
        }}
      >
        <FunnelCurved steps={funnelSteps} width={600} height={180} />
      </Box>
      <Grid container justifyContent="space-between" sx={{ px: 2 }}>
        {funnelSteps.map((step) => (
          <Grid item key={step.label}>
            <Box textAlign="center">
              <Typography variant="subtitle2">{step.value.toLocaleString()}</Typography>
              <Typography variant="caption" color="text.secondary">
                {step.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
}