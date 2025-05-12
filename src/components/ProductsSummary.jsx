import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, Grid, Divider } from '@mui/material';
import { Megaphone, ShoppingBag, CheckCircle, TrendingUp } from 'lucide-react';
import { apiFetchAdsWithProfitAsync } from '@api/api';

const ProductSummary = ({ product, ads }) => {
  const [adsData, setAdsData] = useState([]);

  useEffect(() => {
    const loadAds = async () => {
      if (!ads) {
        try {
          const ads = await apiFetchAdsWithProfitAsync();
          console.log('✅ Fetched ads with profit:', ads);
          setAdsData(ads);
        } catch (error) {
          console.error('❌ Error loading ads:', error);
        }
      } else {
        setAdsData(ads);
      }
    };

    loadAds();
  }, []);

  const totalViews = adsData.reduce((sum, ad) => sum + ad.views, 0);
  const totalClicks = adsData.reduce((sum, ad) => sum + ad.clicks, 0);
  const totalConversions = adsData.reduce((sum, ad) => sum + ad.conversions, 0);
  const totalProfit = adsData.reduce((sum, ad) => sum + ad.profit, 0);
  console.log(product);
  return (
    <Box sx={{ width: '1170px', mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            mb: 2,
          }}
        >
          <Box
            sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}
          >
            <ShoppingBag size={24} color='#2563EB' />
            <Typography variant='h4' sx={{ ml: 1.5, fontWeight: 'bold' }}>
              {product?.name || 'Unknown Product'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                Views
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Megaphone size={18} color='#6B7280' />
                <Typography variant='h6' component='div' sx={{ ml: 1 }}>
                  {totalViews > 0 ? totalViews : 0}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                Clicks
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle size={18} color='#10B981' />
                <Typography variant='h6' component='div' sx={{ ml: 1 }}>
                  {totalClicks > 0 ? totalClicks : 0}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                Conversions
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp size={18} color='#3B82F6' />
                <Typography variant='h6' component='div' sx={{ ml: 1 }}>
                  {totalConversions > 0 ? totalConversions : 0}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                ml: 88,
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant='subtitle2' color='text.secondary'>
                  Total Earned Profit from Ads
                </Typography>
                <Typography variant='h5' color='success.main'>
                  ${totalProfit > 0 ? totalProfit.toFixed(2) : 0}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProductSummary;
