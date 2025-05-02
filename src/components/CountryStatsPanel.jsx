import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import Flag from 'react-world-flags';

const mockData = {
  revenue: [
    { code: 'DE', country: 'Germany', value: 32800, percent: 24.5 },
    { code: 'FR', country: 'France', value: 29100, percent: 21.7 },
    { code: 'US', country: 'USA', value: 25800, percent: 19.3 },
    { code: 'HR', country: 'Croatia', value: 19900, percent: 14.9 },
  ],
  orders: [
    { code: 'US', country: 'USA', value: 1234, percent: 28.3 },
    { code: 'DE', country: 'Germany', value: 1100, percent: 25.3 },
    { code: 'ES', country: 'Spain', value: 950, percent: 19.5 },
    { code: 'BA', country: 'Bosnia', value: 810, percent: 18.7 },
  ],
  users: [
    { code: 'BA', country: 'Bosnia', value: 634, percent: 22.8 },
    { code: 'RS', country: 'Serbia', value: 589, percent: 21.1 },
    { code: 'HR', country: 'Croatia', value: 562, percent: 19.5 },
    { code: 'DE', country: 'Germany', value: 453, percent: 16.3 },
  ],
};

const CountryStatsPanel = () => {
  const [tab, setTab] = useState(0);
  const labels = [
    'Revenue by Country',
    'Orders by Country',
    'Users by Country',
  ];
  const keys = ['revenue', 'orders', 'users'];
  const data = mockData[keys[tab]];

  return (
    <Card sx={{ borderRadius: 4, boxShadow: 3, height: '100%' }}>
      <CardContent>
        <Typography fontWeight={600} mb={1}>
          {labels[tab]}
        </Typography>

        <Tabs
          value={tab}
          onChange={(e, newVal) => setTab(newVal)}
          size='small'
          textColor='primary'
          indicatorColor='primary'
          sx={{ mb: 2 }}
        >
          <Tab label='Revenue' />
          <Tab label='Orders' />
          <Tab label='Users' />
        </Tabs>

        {data.map((item, index) => (
          <Box key={index} mt={2}>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              <Box display='flex' alignItems='center' gap={1}>
                <Flag
                  code={item.code}
                  style={{ width: 24, height: 16, borderRadius: 2 }}
                />
                <Typography fontSize={14} color='text.secondary'>
                  {item.country}
                </Typography>
              </Box>
              <Typography fontSize={14} fontWeight={600}>
                {item.value.toLocaleString()} • {item.percent}%
              </Typography>
            </Box>
            <LinearProgress
              variant='determinate'
              value={item.percent}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: '#e5e7eb',
                '& .MuiLinearProgress-bar': { backgroundColor: '#0f766e' },
                mt: 0.5,
              }}
            />
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default CountryStatsPanel;
