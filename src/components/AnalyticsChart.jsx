import React, { useEffect, useState } from 'react';
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
import {
  apiFetchOrdersAsync,
  apiFetchAllUsersAsync,
} from '../api/api.js';

function getLast12Months() {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(
      d.toLocaleString('default', { month: 'short', year: 'numeric' })
    );
  }
  return months;
}

function generateTargets(realValues, minOffset = -0.1, maxOffset = 0.15) {
  // Generiši targete koji su blizu stvarnih vrijednosti, ali malo variraju
  return realValues.map((item) => {
    const offset =
      minOffset +
      Math.random() * (maxOffset - minOffset); // npr. -10% do +15%
    return Math.round(item * (1 + offset));
  });
}

const AnalyticsChart = () => {
  const [tab, setTab] = useState(0);
  const [chartData, setChartData] = useState({
    revenue: [],
    orders: [],
    registrations: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const months = getLast12Months();

      // 1. Orders
      const orders = await apiFetchOrdersAsync();
      // 2. Users
      const response  = await apiFetchAllUsersAsync();
      const users = response.data;

      // 3. Revenue po mjesecima
      const revenueByMonth = months.map((monthLabel, idx) => {
        // Pronađi početak i kraj mjeseca
        const d = new Date();
        d.setMonth(d.getMonth() - (11 - idx), 1);
        const start = new Date(d.getFullYear(), d.getMonth(), 1);
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);

        const monthOrders = orders.filter(
          (o) =>
            new Date(o.createdAt) >= start && new Date(o.createdAt) < end
        );
        const revenue = monthOrders.reduce(
          (sum, o) => sum + (o.totalPrice || 0),
          0
        );
        return revenue;
      });

      // 4. Orders po mjesecima
      const ordersByMonth = months.map((monthLabel, idx) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (11 - idx), 1);
        const start = new Date(d.getFullYear(), d.getMonth(), 1);
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);

        const monthOrders = orders.filter(
          (o) =>
            new Date(o.createdAt) >= start && new Date(o.createdAt) < end
        );
        return monthOrders.length;
      });

      // 5. Registrations po mjesecima
      const registrationsByMonth = months.map((monthLabel, idx) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (11 - idx), 1);
        const start = new Date(d.getFullYear(), d.getMonth(), 1);
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);

        const monthUsers = users.filter(
          (u) =>
            new Date(u.createdAt) >= start && new Date(u.createdAt) < end
        );
        return monthUsers.length;
      });

      // 6. Generiši targete
      const revenueTargets = generateTargets(revenueByMonth, -0.05, 0.12);
      const ordersTargets = generateTargets(ordersByMonth, -0.08, 0.15);
      const registrationsTargets = generateTargets(registrationsByMonth, -0.1, 0.2);

      // 7. Pripremi podatke za graf
      setChartData({
        revenue: months.map((month, i) => ({
          month,
          revenue: revenueByMonth[i],
          target: revenueTargets[i],
        })),
        orders: months.map((month, i) => ({
          month,
          orders: ordersByMonth[i],
          target: ordersTargets[i],
        })),
        registrations: months.map((month, i) => ({
          month,
          registrations: registrationsByMonth[i],
          target: registrationsTargets[i],
        })),
      });
    };

    fetchData();
  }, []);

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
          <LineChart data={chartData.revenue}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='month' />
            <YAxis tickFormatter={(v) => `$${Math.round(v / 1000)}K`} />
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
              strokeDasharray="5 5"
            />
          </LineChart>
        )}
        {tab === 1 && (
          <LineChart data={chartData.orders}>
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
            <Line
              type='monotone'
              dataKey='target'
              stroke='#f59e0b'
              strokeWidth={2}
              name='Target'
              strokeDasharray="5 5"
            />
          </LineChart>
        )}
        {tab === 2 && (
          <LineChart data={chartData.registrations}>
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
            <Line
              type='monotone'
              dataKey='target'
              stroke='#f59e0b'
              strokeWidth={2}
              name='Target'
              strokeDasharray="5 5"
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
};

export default AnalyticsChart;
