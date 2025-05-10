import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { apiGetAllAdsAsync } from '../api/api.js';

const gaugeColor = '#0F766E';
const bgColor = '#E5E7EB';

const UserDistribution = () => {
  const [conversionRate, setConversionRate] = useState(0);
  const [totalConversions, setTotalConversions] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const adsResponse = await apiGetAllAdsAsync();
      const ads = adsResponse.data;
      const conversions = ads.reduce(
        (sum, ad) => sum + (ad.conversions || 0),
        0
      );
      const clicks = ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
      setTotalConversions(conversions);
      setTotalClicks(clicks);
      console.log('CONVersions: ', conversions);
      console.log('clicks: ', clicks);

      setConversionRate(clicks > 0 ? (conversions / clicks) * 100 : 0);
    };
    fetchData();
  }, []);

  const gaugeData = [
    { name: 'Conversion Rate', value: conversionRate, color: gaugeColor },
    { name: 'Remaining', value: 100 - conversionRate, color: bgColor },
  ];

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
          Conversion Rate (All Ads)
        </Typography>
        <Typography variant='body2' align='center' color='text.secondary'>
          {totalConversions} conversions / {totalClicks} clicks
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={gaugeData}
              dataKey='value'
              startAngle={180}
              endAngle={0}
              innerRadius='60%'
              outerRadius='80%'
              cornerRadius={10}
            >
              {gaugeData.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Box
          sx={{
            position: 'absolute',
            top: '48%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant='h5' sx={{ color: 'primary.dark' }}>
            {totalClicks > 0 ? conversionRate.toFixed(1) : 0}%
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default UserDistribution;
