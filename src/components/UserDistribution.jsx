import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const totalUsers = 5420;
const buyers = 3400;
const sellers = 2020;
const approved = 4870;

const gaugeData = [
  { name: 'Approved', value: approved, color: '#0F766E' },
  { name: 'Remaining', value: totalUsers - approved, color: '#E5E7EB' },
];

const UserDistribution = () => (
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <CardContent sx={{ flexShrink: 0 }}>
      <Typography variant='h6' align='center'>
        Approved Users
      </Typography>
      <Typography variant='body2' align='center' color='text.secondary'>
        of {totalUsers.toLocaleString()} total users
      </Typography>
    </CardContent>
    <Box sx={{ flexGrow: 1, position: 'relative' }}>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={gaugeData}
            dataKey='value'
            startAngle={180}
            endAngle={0}
            innerRadius='60%'
            outerRadius='80%'
            cornerRadius={10}
          >
            {gaugeData.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <Box
        sx={{
          position: 'absolute',
          top: '48%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Typography variant='h5' sx={{ color: 'primary.dark' }}>
          {Math.round((approved / totalUsers) * 100)}%
        </Typography>
      </Box>
    </Box>
    <Box
      sx={{
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'space-between',
        px: 3,
        pb: 2,
      }}
    >
      <Typography variant='body2'>Buyers</Typography>
      <Typography variant='body2'>Sellers</Typography>
    </Box>
  </Card>
);

export default UserDistribution;
