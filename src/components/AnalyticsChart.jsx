import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
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

const sampleData = {
  revenue: [
    { month: 'Mar 2023', revenue: 18000, target: 15000 },
    { month: 'Apr 2023', revenue: 16500, target: 16000 },
    { month: 'May 2023', revenue: 14200, target: 16000 },
    { month: 'Jun 2023', revenue: 12000, target: 15500 },
    { month: 'Jul 2023', revenue: 11000, target: 15500 },
    { month: 'Aug 2023', revenue: 12800, target: 15000 },
    { month: 'Sep 2023', revenue: 13500, target: 15200 },
    { month: 'Oct 2023', revenue: 14300, target: 15200 },
    { month: 'Nov 2023', revenue: 15500, target: 15200 },
    { month: 'Dec 2023', revenue: 17000, target: 16000 },
  ],
  orders: [
    { month: 'Mar 2023', orders: 200 },
    { month: 'Apr 2023', orders: 180 },
    { month: 'May 2023', orders: 150 },
    { month: 'Jun 2023', orders: 130 },
    { month: 'Jul 2023', orders: 120 },
    { month: 'Aug 2023', orders: 140 },
    { month: 'Sep 2023', orders: 160 },
    { month: 'Oct 2023', orders: 170 },
    { month: 'Nov 2023', orders: 185 },
    { month: 'Dec 2023', orders: 190 },
  ],
  registrations: [
    { month: 'Mar 2023', registrations: 85 },
    { month: 'Apr 2023', registrations: 70 },
    { month: 'May 2023', registrations: 60 },
    { month: 'Jun 2023', registrations: 50 },
    { month: 'Jul 2023', registrations: 45 },
    { month: 'Aug 2023', registrations: 55 },
    { month: 'Sep 2023', registrations: 65 },
    { month: 'Oct 2023', registrations: 80 },
    { month: 'Nov 2023', registrations: 95 },
    { month: 'Dec 2023', registrations: 110 },
  ],
};

const AnalyticsChart = () => {
  const [tab, setTab] = useState(0);

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
          {tab === 0 && 'Revenue Over Time'}
          {tab === 1 && 'Orders Per Month'}
          {tab === 2 && 'User Registrations'}
        </Typography>
        <Tabs
          value={tab}
          onChange={handleChange}
          textColor='primary'
          indicatorColor='primary'
        >
          <Tab label='Revenue' />
          <Tab label='Orders' />
          <Tab label='Registrations' />
        </Tabs>
      </Box>

      <ResponsiveContainer width='100%' height={300}>
        {tab === 0 && (
          <LineChart data={sampleData.revenue}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='month' />
            <YAxis tickFormatter={(v) => `$${v / 1000}K`} />
            <Tooltip formatter={(val) => `$${val}`} />
            <Legend />
            <Line
              type='monotone'
              dataKey='revenue'
              stroke='#0f766e'
              strokeWidth={2}
              name='Total Revenue'
            />
            <Line
              type='monotone'
              dataKey='target'
              stroke='#f59e0b'
              strokeWidth={2}
              name='Target'
            />
          </LineChart>
        )}
        {tab === 1 && (
          <LineChart data={sampleData.orders}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='month' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type='monotone'
              dataKey='orders'
              stroke='#0f766e'
              strokeWidth={2}
              name='Orders'
            />
          </LineChart>
        )}
        {tab === 2 && (
          <LineChart data={sampleData.registrations}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='month' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type='monotone'
              dataKey='registrations'
              stroke='#0f766e'
              strokeWidth={2}
              name='Registrations'
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
};

export default AnalyticsChart;
