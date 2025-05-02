import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import KpiCard from '@components/KpiCard';
import AnalyticsChart from '@components/AnalyticsChart';
import CountryStatsPanel from '@components/CountryStatsPanel';
import OrdersByStatus from '@components/OrdersByStatus';
import UserDistribution from '@components/UserDistribution';
import RevenueByStore from '@components/RevenueByStore';

const AnalyticsPage = () => {
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
            label: 'Ukupan broj narudžbi',
            value: '1,229',
            change: 8.3,
            type: 'orders',
          },
          {
            label: 'Ukupan broj korisnika',
            value: '5,420',
            change: 1.4,
            type: 'users',
          },
          {
            label: 'Ukupan broj prodavnica',
            value: '210',
            change: 0.9,
            type: 'stores',
          },
          {
            label: 'Ukupan broj proizvoda',
            value: '7,813',
            change: 3.2,
            type: 'products',
          },
          {
            label: 'Ukupan prihod',
            value: '$32,499.93',
            change: 4.6,
            type: 'income',
          },
          {
            label: 'Aktivne prodavnice',
            value: '185',
            change: 1.1,
            type: 'activeStores',
          },
          {
            label: 'Odobreni korisnici',
            value: '4,870',
            change: 2.5,
            type: 'approvedUsers',
          },
          {
            label: 'Nove registracije',
            value: '132',
            change: 6.3,
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
