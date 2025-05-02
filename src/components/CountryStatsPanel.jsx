import React, { useEffect, useState } from 'react';
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
import {
  apiGetAllStoresAsync,
  apiFetchOrdersAsync,
} from '../api/api.js';


// Ovdje možeš proširiti mapu gradova na country code i ime države
const cityToCountry = {
  Sarajevo: { code: 'BA', country: 'Bosnia and Herzegovina' },
  Zagreb: { code: 'HR', country: 'Croatia' },
  Belgrade: { code: 'RS', country: 'Serbia' },
  Berlin: { code: 'DE', country: 'Germany' },
  Paris: { code: 'FR', country: 'France' },
  // Dodaj ostale gradove po potrebi
};

const CountryStatsPanel = () => {
  const [tab, setTab] = useState(0);
  const [data, setData] = useState({ revenue: [], orders: [] });

  useEffect(() => {
    const fetchData = async () => {
      const [stores, orders] = await Promise.all([
        apiGetAllStoresAsync(),
        apiFetchOrdersAsync(),
      ]);

      // Mapiraj storeId na country info koristeći placeName
      const storeMap = {};
      stores.forEach((store) => {
        const countryInfo =
          cityToCountry[store.placeName] || {
            code: 'UN',
            country: store.placeName || 'Unknown',
          };
        storeMap[store.id] = countryInfo;
      });

      // Revenue po "državi"
      const revenueByCountry = {};
      let totalRevenue = 0;
      orders.forEach((order) => {
        const store = storeMap[order.storeId]; 
        if (!store) return;
        const key = store.code;
        if (!revenueByCountry[key]) {
          revenueByCountry[key] = {
            code: store.code,
            country: store.country,
            value: 0,
            count: 0,
          };
        }
        revenueByCountry[key].value += order.totalPrice || 0;
        revenueByCountry[key].count += 1;
        totalRevenue += order.totalPrice || 0;
      });

      // Orders po "državi"
      const ordersByCountry = {};
      let totalOrders = 0;
      orders.forEach((order) => {
        const store = storeMap[order.storeId];
        if (!store) return;
        const key = store.code;
        if (!ordersByCountry[key]) {
          ordersByCountry[key] = {
            code: store.code,
            country: store.country,
            value: 0,
          };
        }
        ordersByCountry[key].value += 1;
        totalOrders += 1;
      });

      // Pretvori u niz i izračunaj procente
      const revenueArr = Object.values(revenueByCountry)
        .map((item) => ({
          ...item,
          percent: totalRevenue
            ? Number(((item.value / totalRevenue) * 100).toFixed(1))
            : 0,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 4); // top 4

      const ordersArr = Object.values(ordersByCountry)
        .map((item) => ({
          ...item,
          percent: totalOrders
            ? Number(((item.value / totalOrders) * 100).toFixed(1))
            : 0,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 4);

      setData({
        revenue: revenueArr,
        orders: ordersArr,
      });
    };

    fetchData();
  }, []);

  const labels = ['Revenue by Country', 'Orders by Country'];
  const keys = ['revenue', 'orders'];
  const currentData = data[keys[tab]] || [];

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
        </Tabs>

        {currentData.map((item, index) => (
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
