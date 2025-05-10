import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
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
  DollarSign,
  TrendingUp,
  BarChart2,
  Store,
} from 'lucide-react';

// mock 
const mockStats = [
  { month: 'Jan', earningsFromClicks: 80, earningsFromViews: 20, earningsFromConversions: 100 },
  { month: 'Feb', earningsFromClicks: 90, earningsFromViews: 25, earningsFromConversions: 105 },
  { month: 'Mar', earningsFromClicks: 110, earningsFromViews: 30, earningsFromConversions: 120 },
  { month: 'Apr', earningsFromClicks: 130, earningsFromViews: 40, earningsFromConversions: 150 },
  { month: 'May', earningsFromClicks: 145, earningsFromViews: 50, earningsFromConversions: 160 },
  { month: 'Jun', earningsFromClicks: 160, earningsFromViews: 60, earningsFromConversions: 175 },
];
const mockRealtimeStats = {
  sellerName: 'prodavnica',
  earningsFromClicks: 106.0,
  earningsFromClicksOverTime: [10, 20, 30, 46, 55, 63],
  earningsFromViews: 33.6,
  earningsFromViewsOverTime: [5, 8, 10, 10.6, 12, 14],
  earningsFromConversions: 220.0,
  earningsFromConversionsOverTime: [40, 60, 50, 70, 85, 90],
  totalEarnings: 359.6,
  sellerProfit: 287.68,
};

const iconMap = {
  'Total Earnings': <DollarSign size={20} />,
  'Seller Profit': <TrendingUp size={20} />,
  'View Revenue': <BarChart2 size={20} />,
  'Conversion Revenue': <BarChart2 size={20} />,
};

const SellerAnalytics = () => {
  const [stats] = useState(mockStats);
  const [summary] = useState(mockRealtimeStats);

  const topStats = [
    { label: 'Total Earnings', value: `${summary.totalEarnings.toFixed(2)} €`, change: -5.2 },
    { label: 'Seller Profit', value: `${summary.sellerProfit.toFixed(2)} €`, change: 2.1 },
    { label: 'View Revenue', value: `${summary.earningsFromViews.toFixed(2)} €`, change: -3.6 },
    { label: 'Conversion Revenue', value: `${summary.earningsFromConversions.toFixed(2)} €`, change: 4.9 },
  ];

  return (
    <Box sx={{ px: 10, pt: 4, pb: 6, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={800} mb={1} color="primary.dark">
        Seller Performance Dashboard
      </Typography>
      <Box display="flex" alignItems="center" mb={4} gap={1}>
        <Store size={20} color="#0f766e" />
        <Typography variant="h6" fontWeight={600} color="text.secondary">
          {summary.sellerName}
        </Typography>
      </Box>

      <Grid container spacing={4} mb={3}>
        {topStats.map((item, idx) => (
          <Grid item key={idx}>
            <Card sx={{ backgroundColor: '#fff', borderRadius: 4, boxShadow: 3, p: 2, width: 300 }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Box sx={{ color: 'primary.main' }}>
                    {iconMap[item.label]}
                  </Box>
                </Box>

                <Typography variant="h5" fontWeight={800}>
                  {item.value}
                </Typography>

                {item.change !== undefined && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: item.change < 0 ? 'error.main' : 'success.main',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    {item.change < 0 ? '↓' : '↑'} {Math.abs(item.change).toFixed(2)}% Compared to last month
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {[{
          title: 'Click Revenue Over Time',
          color: '#0f766e',
          data: summary.earningsFromClicksOverTime
        }, {
          title: 'View Revenue Over Time',
          color: '#f59e0b',
          data: summary.earningsFromViewsOverTime
        }, {
          title: 'Conversion Revenue Over Time',
          color: '#ef4444',
          data: summary.earningsFromConversionsOverTime
        }].map((graph, idx) => (
          <Grid item xs={12} key={idx}>
            <Box display="flex" justifyContent="center">
              <Card sx={{ backgroundColor: '#fff', borderRadius: 4, boxShadow: 3, p: 3, width: 600 }}>
                <Typography variant='h6' fontWeight={700} mb={2}>
                  {graph.title}
                </Typography>
                <ResponsiveContainer width='100%' height={300}>
                  <LineChart
                    data={stats.slice(-5).map((s, i) => ({
                      month: s.month,
                      value: graph.data.slice(-5)[i],
                    }))}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='month' />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type='monotone'
                      dataKey='value'
                      stroke={graph.color}
                      strokeWidth={2}
                      name={`${graph.title} (€)`}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SellerAnalytics;
