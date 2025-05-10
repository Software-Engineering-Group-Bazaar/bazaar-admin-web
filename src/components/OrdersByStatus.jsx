import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { apiGetAllAdsAsync } from '../api/api.js';

// Dodijeli boje svakom triggeru
const triggerColors = {
  Search: '#6366F1',
  Order: '#F59E0B',
  View: '#10B981',
};

const triggerLabels = ['Search', 'Order', 'View'];

const OrdersBystatus = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      const adsRepsonse = await apiGetAllAdsAsync();
      const ads = adsRepsonse.data;
      // Broji koliko reklama ima svaki trigger
      const triggerCounts = { Search: 0, Order: 0, View: 0 };
      ads.forEach((ad) => {
        if (Array.isArray(ad.triggers)) {
          ad.triggers.forEach((trigger) => {
            if (Object.prototype.hasOwnProperty.call(triggerCounts, trigger)) {
              triggerCounts[trigger]++;
            }
          });
        }
      });
      console.log('TREGER: ', triggerCounts);
      // Pripremi podatke za PieChart
      const chartData = triggerLabels.map((trigger) => ({
        name: trigger,
        value: triggerCounts[trigger],
        color: triggerColors[trigger],
      }));

      setData(chartData);
    };

    fetchAds();
  }, []);

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        height: 340,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flexShrink: 0 }}>
        <Typography variant='h6' align='center' gutterBottom>
          Ad Triggers Breakdown
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <ResponsiveContainer width='100%' height='80%'>
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
            <Typography variant='body2'>
              {entry.name} ({entry.value})
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
};

export default OrdersBystatus;
