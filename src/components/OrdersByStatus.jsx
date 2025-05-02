import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { apiFetchOrdersAsync } from '../api/api.js';

// Dodijeli boje svakom statusu
const statusColors = {
  Confirmed: '#6366F1',
  Delivered: '#F59E0B',
  Cancelled: '#EF4444',
  Ready: '#0EA5E9',
  Sent: '#10B981',
  // Dodaj ostale statuse po potrebi
}; //???????????????

const OrdersByStatus = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await apiFetchOrdersAsync();

      // Broji po statusima
      const counts = {};
      orders.forEach((order) => {
        const status = order.status;
        if (counts[status]) {
          counts[status]++;
        } else {
          counts[status] = 1;
        }
      });

      // Pripremi podatke za PieChart
      const chartData = Object.entries(counts)
        .map(([status, value]) => ({
          name: status,
          value,
          color: statusColors[status] || '#888888', // default siva ako nema boje
        }))
        .sort((a, b) => b.value - a.value);

      setData(chartData);
    };

    fetchOrders();
  }, []);

  return (
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
};

export default OrdersByStatus;
