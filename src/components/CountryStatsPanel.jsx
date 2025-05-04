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
  apiGetGeographyAsync,
} from '../api/api.js';

const CountryStatsPanel = () => {
  const [tab, setTab] = useState(0);
  const [data, setData] = useState({ revenue: [], orders: [] });

  useEffect(() => {
    const fetchData = async () => {
      const [stores, orders, geography] = await Promise.all([
        apiGetAllStoresAsync(),
        apiFetchOrdersAsync(),
        apiGetGeographyAsync(),
      ]);

      const { regions, places } = geography;

      const regionMap = {};
      regions.forEach((r) => {
        regionMap[r.id] = {
          name: r.name,
          code: r.countryCode?.toUpperCase() || 'BA',
        };
      });

      const placeNameToRegionId = {};
      places.forEach((p) => {
        placeNameToRegionId[p.name] = p.regionId;
      });

      const storeMap = {};
      stores.forEach((store) => {
        storeMap[store.id] = store;
      });

      const revenueByRegion = {};
      let totalRevenue = 0;

      const ordersByRegion = {};
      let totalOrders = 0;

      orders.forEach((order) => {
        const store = storeMap[order.storeName];
        if (!store) return;

        const regionId = placeNameToRegionId[store.placeName];
        const region = regionMap[regionId];

        const targetId = region ? regionId : 'others';
        const targetRegion = region || { name: 'Others', code: 'BA' };

        if (!revenueByRegion[targetId]) {
          revenueByRegion[targetId] = {
            name: targetRegion.name,
            code: targetRegion.code,
            value: 0,
            count: 0,
          };
        }
        revenueByRegion[targetId].value += order.totalPrice || 0;
        revenueByRegion[targetId].count += 1;
        totalRevenue += order.totalPrice || 0;

        if (!ordersByRegion[targetId]) {
          ordersByRegion[targetId] = {
            name: targetRegion.name,
            code: targetRegion.code,
            value: 0,
          };
        }
        ordersByRegion[targetId].value += 1;
        totalOrders += 1;
      });

      const revenueSorted = Object.values(revenueByRegion).sort(
        (a, b) => b.value - a.value
      );
      const ordersSorted = Object.values(ordersByRegion).sort(
        (a, b) => b.value - a.value
      );

      const topRevenue = revenueSorted.slice(0, 4);
      const otherRevenue = revenueSorted.slice(4).reduce(
        (acc, r) => {
          acc.value += r.value;
          acc.count += r.count;
          return acc;
        },
        { name: 'Others', code: 'BA', value: 0, count: 0 }
      );
      const revenueArr = [...topRevenue];
      if (otherRevenue.value > 0) {
        revenueArr.push({
          ...otherRevenue,
          percent: Number(
            ((otherRevenue.value / totalRevenue) * 100).toFixed(1)
          ),
        });
      }
      revenueArr.forEach((r) => {
        r.percent = Number(((r.value / totalRevenue) * 100).toFixed(1));
      });

      const topOrders = ordersSorted.slice(0, 4);
      const otherOrders = ordersSorted.slice(4).reduce(
        (acc, o) => {
          acc.value += o.value;
          return acc;
        },
        { name: 'Others', code: 'BA', value: 0 }
      );
      const ordersArr = [...topOrders];
      if (otherOrders.value > 0) {
        ordersArr.push({
          ...otherOrders,
          percent: Number(((otherOrders.value / totalOrders) * 100).toFixed(1)),
        });
      }
      ordersArr.forEach((o) => {
        o.percent = Number(((o.value / totalOrders) * 100).toFixed(1));
      });

      setData({ revenue: revenueArr, orders: ordersArr });
    };

    fetchData();
  }, []);

  const labels = ['Revenue by Regions', 'Orders by Regions'];
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
                  code='BA'
                  style={{ width: 24, height: 16, borderRadius: 2 }}
                />
                <Typography fontSize={14} color='text.secondary'>
                  {item.name}
                </Typography>
              </Box>
              <Typography fontSize={14} fontWeight={600}>
                {item.value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                • {item.percent}%
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
