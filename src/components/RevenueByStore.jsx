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
import { apiGetAllStoresAsync, apiGetAllAdsAsync } from '../api/api.js';

const barColor = '#6366F1';
const TOP_N = 5;

const RevenueByStore = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [stores, adsResponse] = await Promise.all([
        apiGetAllStoresAsync(),
        apiGetAllAdsAsync(),
      ]);
      const ads = adsResponse.data;
      console.log('Ads: ', ads);

      // Mapiraj storeId na ime prodavnice
      const storeMap = {};
      stores.forEach((store) => {
        storeMap[store.id] = store.name;
      });
      console.log('STOREMAP: ', storeMap);
      // Grupiraj zaradu po storeId iz adData
      const revenueByStore = {};
      ads.forEach((ad) => {
        if (!ad.conversionPrice || ad.conversionPrice === 0) return;
        // Za svaki adData sa storeId, dodaj cijelu conversionPrice toj prodavnici
        ad.adData.forEach((adDataItem) => {
          if (!adDataItem.storeId) return;
          const storeId = adDataItem.storeId;
          if (!storeMap[storeId]) return;
          revenueByStore[storeId] =
            (revenueByStore[storeId] || 0) + ad.conversionPrice;
        });
      });
      console.log('RevenueByStore: ', revenueByStore);

      const chartData = Object.entries(revenueByStore)
        .map(([storeId, value]) => ({
          name: storeMap[storeId] || `Store #${storeId}`,
          value,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, TOP_N);

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
        p: 1,
      }}
    >
      <CardContent sx={{ flexShrink: 0 }}>
        <Typography variant='h6' align='center'>
          Top Stores by Ad Revenue
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1, px: 2 }}>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            layout='vertical'
            data={data}
            margin={{ top: 1, right: 20, left: 20, bottom: -10 }}
            barCategoryGap={32}
            barGap={20}
          >
            <XAxis
              type='number'
              domain={[0, 'dataMax + 200']}
              tickFormatter={(v) => `$${v.toFixed(0)}`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 13, dy: 2 }}
            />
            <YAxis
              dataKey='name'
              type='category'
              axisLine={false}
              tickLine={false}
              width={120}
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
    </Card>
  );
};

export default RevenueByStore;
