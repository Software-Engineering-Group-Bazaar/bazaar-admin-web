import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { apiGetAllStoresAsync, apiFetchOrdersAsync } from '../api/api.js';

const barColor = '#6366F1';

const RevenueByStore = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [stores, orders] = await Promise.all([
        apiGetAllStoresAsync(),
        apiFetchOrdersAsync(),
      ]);

      // Mapiraj storeId na ime prodavnice
      const storeMap = {};
      stores.forEach((store) => {
        storeMap[store.id] = store.name;
      });

      const revenueByStore = {};
      orders.forEach((order) => {
        const storeId = order.storeName; // order.storeName je zapravo storeId!
        if (!storeMap[storeId]) return; // preskoči ako nema prodavnice
        if (!revenueByStore[storeId]) {
          revenueByStore[storeId] = 0;
        }
        revenueByStore[storeId] += order.totalPrice || 0;
      });

      const chartData = Object.entries(revenueByStore)
        .map(([storeId, value]) => ({
          name: storeMap[storeId] || 'Unknown',
          value,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      console.log('chartData:', chartData);

      setData(chartData);
    };

    fetchData();
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
        <Typography variant='h6' align='center'>
          Revenue by Store
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1, px: 2 }}>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            layout='vertical'
            data={data}
            margin={{ top: 1, right: 20, left: 20, bottom: -10 }}
            barCategoryGap={32} // ili veća vrijednost za veći razmak
            barGap={20} // dodatni razmak između barova
          >
            <XAxis
              type='number'
              domain={[0, 'dataMax + 2000']}
              tickFormatter={(v) => `$${(v / 1000).toFixed(1)}K`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 13, dy: 2 }}
            />
            <YAxis
              dataKey='name'
              type='category'
              axisLine={false}
              tickLine={false}
              width={80} // povećaj po potrebi
              tick={{ fontSize: 14, wordBreak: 'break-all' }}
            />
            <Tooltip formatter={(val) => `$${val}`} />
            <Bar
              dataKey='value'
              fill={barColor}
              barSize={16}
              radius={[0, 8, 8, 0]}
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={barColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ flexShrink: 0, px: 2, pb: 2, textAlign: 'right' }}>
        {/* Prikaži vrijednosti na kraju svakog bara */}
        {data.map((entry) => (
          <Typography
            key={entry.name}
            variant='caption'
            sx={{
              position: 'absolute',
              right: 16,
            }}
          >
            ${entry.value.toLocaleString()}
          </Typography>
        ))}
      </Box>
    </Card>
  );
};

export default RevenueByStore;
