import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import KpiCard from '@components/KpiCard';
import AnalyticsChart from '@components/AnalyticsChart';
import CountryStatsPanel from '@components/CountryStatsPanel';
import OrdersByStatus from '@components/OrdersByStatus';
import UserDistribution from '@components/UserDistribution';
import RevenueByStore from '@components/RevenueByStore';
import ParetoChart from '@components/ParetoChart';
import AdFunnelChart from '@components/AdFunnelChart';
import AdStackedBarChart from '@components/AdStackedBarChart';
import Calendar from '@components/Calendar';
import DealsChart from '@components/DealsChart';
import SalesChart from '@components/SalesChart';
import AdRealtimeMonitor from '../components/AdRealtimeMonitor.jsx';
import { useState, useEffect } from 'react';
import { apiGetAllAdsAsync } from '../api/api.js';
import { format, parseISO } from 'date-fns';

const AnalyticsPage = () => {
  useEffect(() => {
    fetchKpis();
  }, []);

  const fetchKpis = async () => {
    let ads = await apiGetAllAdsAsync();
    ads = ads.data;
    const totalViews = ads.reduce((sum, ad) => sum + (ad.views || 0), 0);
    const totalClicks = ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
    const totalConversionRevenue = ads.reduce(
      (sum, ad) => sum + (ad.conversionPrice || 0),
      0
    );
    const totalAds = ads.length;
    const activeAds = ads.filter((ad) => ad.isActive).length;
    const topAds = [...ads]
      .sort((a, b) => (b.conversionPrice || 0) - (a.conversionPrice || 0))
      .slice(0, 5);
    setKpi({
      totalViews,
      totalClicks,
      totalConversionRevenue,
      totalAds,
      activeAds,
      topAds,
    });
    setAds(ads);
  };

  /* const fetchKpis = async () => {
    // 1. Narudžbe
    const orders = await apiFetchOrdersAsync();
    const now = new Date();
    const lastMonth = subMonths(now, 1);
    const prevMonth = subMonths(now, 2);

    const ordersThisMonth = orders.filter(
      (o) => new Date(o.createdAt) >= lastMonth
    );
    const ordersPrevMonth = orders.filter(
      (o) =>
        new Date(o.createdAt) >= prevMonth && new Date(o.createdAt) < lastMonth
    );
    const ordersChange = ordersPrevMonth.length
      ? ((ordersThisMonth.length - ordersPrevMonth.length) /
          ordersPrevMonth.length) *
        100
      : 100;

    // 2. Korisnici
    const response = await apiFetchAllUsersAsync();
    console.log('RESPONSE: ', response);
    const users = response.data;
    console.log('users: ', users);

    const usersThisMonth = users.filter(
      (u) => new Date(u.createdAt) >= lastMonth
    );
    const usersPrevMonth = users.filter(
      (u) =>
        new Date(u.createdAt) >= prevMonth && new Date(u.createdAt) < lastMonth
    );
    const usersChange = usersPrevMonth.length
      ? ((usersThisMonth.length - usersPrevMonth.length) /
          usersPrevMonth.length) *
        100
      : 100;

    // 3. Prodavnice
    const stores = await apiGetAllStoresAsync();
    const storesThisMonth = stores.filter(
      (s) => new Date(s.createdAt) >= lastMonth
    );
    const storesPrevMonth = stores.filter(
      (s) =>
        new Date(s.createdAt) >= prevMonth && new Date(s.createdAt) < lastMonth
    );
    const storesChange = storesPrevMonth.length
      ? ((storesThisMonth.length - storesPrevMonth.length) /
          storesPrevMonth.length) *
        100
      : 100;

    // 4. Proizvodi
    let totalProducts = 0;
    let productsThisMonth = 0;
    let productsPrevMonth = 0;
    for (const store of stores) {
      const { data: products } = await apiGetStoreProductsAsync(store.id);
      totalProducts += products.length;
      productsThisMonth += products.filter(
        (p) => new Date(p.createdAt) >= lastMonth
      ).length;
      productsPrevMonth += products.filter(
        (p) =>
          new Date(p.createdAt) >= prevMonth &&
          new Date(p.createdAt) < lastMonth
      ).length;
    }
    const productsChange = productsPrevMonth
      ? ((productsThisMonth - productsPrevMonth) / productsPrevMonth) * 100
      : 100;

    // 5. Prihod
    const totalIncome = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const incomeThisMonth = ordersThisMonth.reduce(
      (sum, o) => sum + (o.totalPrice || 0),
      0
    );
    const incomePrevMonth = ordersPrevMonth.reduce(
      (sum, o) => sum + (o.totalPrice || 0),
      0
    );
    const incomeChange = incomePrevMonth
      ? ((incomeThisMonth - incomePrevMonth) / incomePrevMonth) * 100
      : 100;

    // 6. Aktivne prodavnice

    // Sadašnje aktivne prodavnice
    const activeStores = stores.filter((s) => s.isActive).length;

    // Aktivne prodavnice KREIRANE u ovom mjesecu
    const activeStoresThisMonth = stores.filter(
      (s) => s.isActive && new Date(s.createdAt) >= lastMonth
    ).length;

    // Aktivne prodavnice KREIRANE u prošlom mjesecu
    const activeStoresPrevMonth = stores.filter(
      (s) =>
        s.isActive &&
        new Date(s.createdAt) >= prevMonth &&
        new Date(s.createdAt) < lastMonth
    ).length;

    // Promjena u odnosu na prošli mjesec
    const activeStoresChange = activeStoresPrevMonth
      ? ((activeStoresThisMonth - activeStoresPrevMonth) /
          activeStoresPrevMonth) *
        100
      : 100;

    // 7. Odobreni korisnici

    // Sadašnji broj odobrenih korisnika
    const approvedUsers = users.filter((u) => u.isApproved).length;

    // Odobreni korisnici KREIRANI u ovom mjesecu
    const approvedUsersThisMonth = users.filter(
      (u) => u.isApproved && new Date(u.createdAt) >= lastMonth
    ).length;

    // Odobreni korisnici KREIRANI u prošlom mjesecu
    const approvedUsersPrevMonth = users.filter(
      (u) =>
        u.isApproved &&
        new Date(u.createdAt) >= prevMonth &&
        new Date(u.createdAt) < lastMonth
    ).length;

    // Promjena u odnosu na prošli mjesec
    const approvedUsersChange = approvedUsersPrevMonth
      ? ((approvedUsersThisMonth - approvedUsersPrevMonth) /
          approvedUsersPrevMonth) *
        100
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
      activeSt: { total: activeStores, change: activeStoresChange },
      approvedUs: { total: approvedUsers, change: approvedUsersChange },
      newUsers: { total: newUsers, change: newUsersChange },
    });
  };*/

  const [ads, setAds] = useState([]);
  const [kpi, setKpi] = useState({
    totalViews: 0,
    totalClicks: 0,
    totalConversionRevenue: 0,
    totalAds: 0,
    activeAds: 0,
    topAds: [],
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
        <Grid item xs={12} md={2.4}>
          <KpiCard
            label='Total Views (All Ads)'
            value={kpi.totalViews}
            type='views'
          />
        </Grid>
        <Grid item xs={12} md={2.4}>
          <KpiCard
            label='Total Clicks (All Ads)'
            value={kpi.totalClicks}
            type='clicks'
          />
        </Grid>
        <Grid item xs={12} md={2.4}>
          <KpiCard
            label='Total Conversion Revenue'
            value={kpi.totalConversionRevenue}
            type='conversionRevenue'
          />
        </Grid>
        <Grid item xs={12} md={2.4}>
          <KpiCard label='Total Ads' value={kpi.totalAds} type='totalAds' />
        </Grid>
        <Grid item xs={12} md={2.4}>
          <KpiCard label='Active Ads' value={kpi.activeAds} type='activeAds' />
        </Grid>
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

        <Box sx={{ width: '100%' }}>
          {/* Funnel Chart (sam u jednom redu) */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <AdFunnelChart />
              </Box>
            </Grid>
          </Grid>

          {/* Pareto Chart i Stacked Bar Chart (jedan do drugog) */}
          <Grid container spacing={6} mb={3}>
            <Grid item sx={{ width: '45%' }}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <ParetoChart />
              </Box>
            </Grid>
            <Grid item sx={{ width: '45%' }}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <AdStackedBarChart />
              </Box>
            </Grid>
          </Grid>
          {/* Calendar, DealsChart, SalesChart */}
          <Grid container spacing={3} mb={2}>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Calendar />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <DealsChart />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <SalesChart />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <AdRealtimeMonitor/>
    </Box>
  );
};

export default AnalyticsPage;