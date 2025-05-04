import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import KpiCard from '@components/KpiCard';
import AnalyticsChart from '@components/AnalyticsChart';
import CountryStatsPanel from '@components/CountryStatsPanel';
import OrdersByStatus from '@components/OrdersByStatus';
import UserDistribution from '@components/UserDistribution';
import RevenueByStore from '@components/RevenueByStore';
import { useState, useEffect } from "react";
import {
  apiFetchOrdersAsync,
  apiFetchAllUsersAsync,
  apiGetAllStoresAsync,
  apiGetStoreProductsAsync,
} from '../api/api.js';
import { subMonths} from 'date-fns';


const AnalyticsPage = () => {

  useEffect(() => {
    fetchKpis();
  }, []);


  const fetchKpis = async () => {
    // 1. Narudžbe
    const orders = await apiFetchOrdersAsync();
    const now = new Date();
    const lastMonth = subMonths(now, 1);
    const prevMonth = subMonths(now, 2);
  
    const ordersThisMonth = orders.filter(
      o => new Date(o.createdAt) >= lastMonth
    );
    const ordersPrevMonth = orders.filter(
      o => new Date(o.createdAt) >= prevMonth && new Date(o.createdAt) < lastMonth
    );
    const ordersChange = ordersPrevMonth.length
      ? ((ordersThisMonth.length - ordersPrevMonth.length) / ordersPrevMonth.length) * 100
      : 100;
  
    // 2. Korisnici
    const response = await apiFetchAllUsersAsync();
    console.log("RESPONSE: ", response);
    const users = response.data;
    console.log("users: ", users);

    const usersThisMonth = users.filter(
      u => new Date(u.createdAt) >= lastMonth
    );
    const usersPrevMonth = users.filter(
      u => new Date(u.createdAt) >= prevMonth && new Date(u.createdAt) < lastMonth
    );
    const usersChange = usersPrevMonth.length
      ? ((usersThisMonth.length - usersPrevMonth.length) / usersPrevMonth.length) * 100
      : 100;
  
    // 3. Prodavnice
    const stores = await apiGetAllStoresAsync();
    const storesThisMonth = stores.filter(
      s => new Date(s.createdAt) >= lastMonth
    );
    const storesPrevMonth = stores.filter(
      s => new Date(s.createdAt) >= prevMonth && new Date(s.createdAt) < lastMonth
    );
    const storesChange = storesPrevMonth.length
      ? ((storesThisMonth.length - storesPrevMonth.length) / storesPrevMonth.length) * 100
      : 100;
  
    // 4. Proizvodi
    let totalProducts = 0;
    let productsThisMonth = 0;
    let productsPrevMonth = 0;
    for (const store of stores) {
      const { data: products } = await apiGetStoreProductsAsync(store.id);
      totalProducts += products.length;
      productsThisMonth += products.filter(
        p => new Date(p.createdAt) >= lastMonth
      ).length;
      productsPrevMonth += products.filter(
        p => new Date(p.createdAt) >= prevMonth && new Date(p.createdAt) < lastMonth
      ).length;
    }
    const productsChange = productsPrevMonth
      ? ((productsThisMonth - productsPrevMonth) / productsPrevMonth) * 100
      : 100;
  
    // 5. Prihod
    const totalIncome = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const incomeThisMonth = ordersThisMonth.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const incomePrevMonth = ordersPrevMonth.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const incomeChange = incomePrevMonth
      ? ((incomeThisMonth - incomePrevMonth) / incomePrevMonth) * 100
      : 100;
  
    // 6. Aktivne prodavnice
  
  // Sadašnje aktivne prodavnice
  const activeStores = stores.filter(s => s.isActive).length;
  
  // Aktivne prodavnice KREIRANE u ovom mjesecu
  const activeStoresThisMonth = stores.filter(
    s => s.isActive && new Date(s.createdAt) >= lastMonth
  ).length;
  
  // Aktivne prodavnice KREIRANE u prošlom mjesecu
  const activeStoresPrevMonth = stores.filter(
    s => s.isActive &&
         new Date(s.createdAt) >= prevMonth &&
         new Date(s.createdAt) < lastMonth
  ).length;
  
  // Promjena u odnosu na prošli mjesec
  const activeStoresChange = activeStoresPrevMonth
    ? ((activeStoresThisMonth - activeStoresPrevMonth) / activeStoresPrevMonth) * 100
    : 100;
  
  
    // 7. Odobreni korisnici
  
  // Sadašnji broj odobrenih korisnika
  const approvedUsers = users.filter(u => u.isApproved).length;
  
  // Odobreni korisnici KREIRANI u ovom mjesecu
  const approvedUsersThisMonth = users.filter(
    u => u.isApproved && new Date(u.createdAt) >= lastMonth
  ).length;
  
  // Odobreni korisnici KREIRANI u prošlom mjesecu
  const approvedUsersPrevMonth = users.filter(
    u => u.isApproved &&
         new Date(u.createdAt) >= prevMonth &&
         new Date(u.createdAt) < lastMonth
  ).length;
  
  // Promjena u odnosu na prošli mjesec
  const approvedUsersChange = approvedUsersPrevMonth
    ? ((approvedUsersThisMonth - approvedUsersPrevMonth) / approvedUsersPrevMonth) * 100
    : 100;
  
  
    // 8. Nove registracije
    const newUsers = usersThisMonth.length;
    const newUsersPrev = usersPrevMonth.length;
    const newUsersChange = newUsersPrev
      ? ((newUsers - newUsersPrev) / newUsersPrev) * 100
      : 100;
  
    setKpi({
      orders: { total: orders.length, change: ordersChange },
      users: { total: users.length, change: usersChange },
      stores: { total: stores.length, change: storesChange },
      products: { total: totalProducts, change: productsChange },
      income: { total: totalIncome, change: incomeChange },
      activeSt: {total: activeStores, change: activeStoresChange},
      approvedUs: {total: approvedUsers, change: approvedUsersChange},
      newUsers: { total: newUsers, change: newUsersChange },
    });
  };





  const [kpi, setKpi] = useState({
    orders: { total: 0, change: 0 },
    users: { total: 0, change: 0 },
    stores: { total: 0, change: 0 },
    products: { total: 0, change: 0 },
    income: { total: 0, change: 0 },
    activeSt: 0,
    approvedUs: 0,
    newUsers: 0,
  });
  
  return (
    <Box
      sx={{
        pl: 42,
        pr: 4,
        pt: 4,
        pb: 8,
        height: '100vh',
        overflowY: 'auto',

        /* --- Moderni custom scrollbar --- */
        '&::-webkit-scrollbar': {
          width: 8,
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(15, 118, 110, 0.6)', // tvoja primarna tamno-zelena
          borderRadius: 4,
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: 'rgba(15, 118, 110, 0.8)',
        },

        /* FireFox */
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(15,118,110,0.6) transparent',
      }}
    >
      <Typography
        variant='h4'
        sx={{
          fontWeight: 900,
          fontSize: { xs: '1.4rem', md: '2rem' },
          letterSpacing: '0.3px',
          mb: 4,
          color: 'primary.dark',
          lineHeight: 1.2,
        }}
      >
        Dashboard Analytics
      </Typography>

      {/* KPI sekcija */}
      <Grid container spacing={3} mb={3} width={1200}>
        {[
          {
            label: 'Total Orders',
            value: kpi.orders.total,
            change: kpi.orders.change,
            type: 'orders',
          },
          {
            label: 'Total Users',
            value: kpi.users.total,
            change: kpi.users.change,
            type: 'users',
          },
          {
            label: 'Total Stores',
            value: kpi.stores.total,
            change: kpi.stores.change, // ispravljeno s kpi.stores.total
            type: 'stores',
          },
          {
            label: 'Total Products',
            value: kpi.products.total,
            change: kpi.products.change,
            type: 'products',
          },
          {
            label: 'Total Revenue',
            value: kpi.income.total,
            change: kpi.income.change,
            type: 'income',
          },
          {
            label: 'Active Stores',
            value: kpi.activeSt.total,
            change: kpi.activeSt.change,
            type: 'activeStores',
          },
          {
            label: 'Approved Users',
            value: kpi.approvedUs.total,
            change: kpi.approvedUs.change,
            type: 'approvedUsers',
          },
          {
            label: 'New Registrations',
            value: kpi.newUsers.total,
            change: kpi.newUsers.change,
            type: 'newUsers',
          },
        ].map((item, i) => (
          <Grid item xs={12} md={3} key={i}>
            <KpiCard
              label={item.label}
              value={item.value}
              percentageChange={item.change}
              type={item.type}
            />
          </Grid>
        ))}
      </Grid>

      {/* Glavni graf + countries */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={9}>
          <Box sx={{ height: 420, width: '850px' }}>
            <AnalyticsChart />
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ height: 420, width: '320px' }}>
            <CountryStatsPanel />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ width: 1210, mt: 4 }}>
        <Grid container spacing={2}>
          <Grid item sx={{ width: '32%' }}>
            <Box sx={{ height: 340, display: 'flex', flexDirection: 'column' }}>
              <OrdersByStatus />
            </Box>
          </Grid>
          <Grid item sx={{ width: '32%' }}>
            <Box sx={{ height: 340, display: 'flex', flexDirection: 'column' }}>
              <UserDistribution />
            </Box>
          </Grid>
          <Grid item sx={{ width: '32%' }}>
            <Box sx={{ height: 340, display: 'flex', flexDirection: 'column' }}>
              <RevenueByStore />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AnalyticsPage;
