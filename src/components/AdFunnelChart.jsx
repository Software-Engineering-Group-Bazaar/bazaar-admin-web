import React from 'react';
import { Card, Typography, Box, Grid, Icon } from '@mui/material';
import FunnelCurved from './FunnelCurved';
import {
  VisibilityOutlined,
  CheckCircleOutline,
  ShoppingCartOutlined,
  CreditCardOutlined,
  VerifiedOutlined,
} from '@mui/icons-material';

const funnelSteps = [
  {
    label: 'Viewed',
    value: 6800,
    percent: 100,
    color: '#60a5fa',
    icon: <VisibilityOutlined />,
  },
  {
    label: 'Clicked',
    value: 5750,
    percent: 85,
    color: '#38bdf8',
    icon: <CheckCircleOutline />,
  },
  {
    label: 'Add to Cart',
    value: 4500,
    percent: 66,
    color: '#0ea5e9',
    icon: <ShoppingCartOutlined />,
  },
  {
    label: 'Checkout',
    value: 3400,
    percent: 50,
    color: '#0369a1',
    icon: <CreditCardOutlined />,
  },
  {
    label: 'Purchased',
    value: 1200,
    percent: 18,
    color: '#0a2540',
    icon: <VerifiedOutlined />,
  },
];

const stats = [
  {
    label: 'Weekly',
    value: '$3,113',
    change: '+10.3%',
    sub: 'Compared to $1,110 last week',
    bgColor: '#e0f7fa',
  },
  {
    label: 'Monthly',
    value: '$9,243',
    change: '+3.7%',
    sub: 'Compared to $6,453 last month',
    bgColor: '#e8f5e9',
  },
  {
    label: 'Yearly',
    value: '$99,898',
    change: '+18.3%',
    sub: 'Compared to $79,098 last year',
    bgColor: '#fce4ec',
  },
];

export default function AdFunnelChart() {
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
              <Typography variant='body2' color='success.main' fontWeight={600}>
                {stat.change}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {stat.sub}
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
          <Grid item xs={12} sm={2.4} key={step.label} sx={{ flexGrow: 1 }}>
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
              <Typography variant='h8' color='text.secondary'>
                {step.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
}
