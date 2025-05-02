import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Confirmed', value: 320, color: '#6366F1' },
  { name: 'Delivered', value: 280, color: '#F59E0B' },
  { name: 'Cancelled', value: 150, color: '#EF4444' },
  { name: 'Ready', value: 90, color: '#0EA5E9' },
  { name: 'Sent', value: 60, color: '#10B981' },
];

const OrdersByStatus = () => (
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
      <Typography variant='h6' align='center' gutterBottom>
        Orders by Status
      </Typography>
    </CardContent>
    <Box sx={{ flexGrow: 1, position: 'relative' }}>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={data}
            dataKey='value'
            innerRadius='60%'
            outerRadius='80%'
            startAngle={90}
            endAngle={-270}
            paddingAngle={3}
          >
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Box>
    <Box
      sx={{
        flexShrink: 0,
        px: 2,
        py: 1,
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
      }}
    >
      {data.map((entry) => (
        <Box
          key={entry.name}
          sx={{ display: 'flex', alignItems: 'center', m: 0.5 }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              bgcolor: entry.color,
              borderRadius: '50%',
              mr: 0.5,
            }}
          />
          <Typography variant='body2'>{entry.name}</Typography>
        </Box>
      ))}
    </Box>
  </Card>
);

export default OrdersByStatus;
