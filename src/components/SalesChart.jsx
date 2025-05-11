import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  useTheme,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  apiGetAllAdsAsync,
  apiGetAllStoresAsync,
  apiGetStoreProductsAsync,
} from '../api/api.js';

function SalesChart() {
  const theme = useTheme();
  const [filterType, setFilterType] = useState('topRated');
  const [anchorEl, setAnchorEl] = useState(null);
  const [productData, setProductData] = useState([]);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dohvati sve reklame
        const adsResponse = await apiGetAllAdsAsync();
        const ads = adsResponse.data || [];

        // Dohvati sve storeove
        const storesResponse = await apiGetAllStoresAsync();
        const stores = storesResponse || [];

        // Kreiraj mapu svih proizvoda iz svih storeova
        const allProducts = {};
        for (const store of stores) {
          const productsResponse = await apiGetStoreProductsAsync(store.id);
          for (const product of productsResponse.data) {
            if (!allProducts[product.id]) {
              allProducts[product.id] = {
                id: product.id,
                name: product.name,
                imageUrl: 'https://via.placeholder.com/150',
                clicks: 0,
                conversions: 0,
                revenue: 0,
              };
            }
          }
        }

        // Obradi sve reklame
        for (const ad of ads) {
          for (const adDataItem of ad.adData || []) {
            const productId = adDataItem.productId;
            if (allProducts[productId]) {
              allProducts[productId].clicks += ad.clicks || 0;
              allProducts[productId].conversions += ad.conversions || 0;
              allProducts[productId].revenue +=
                (ad.conversions || 0) * (ad.conversionPrice || 0);
            }
          }
        }

        // Sortiraj proizvode po zaradi
        const sortedProducts = Object.values(allProducts).sort((a, b) => {
          return filterType === 'topRated'
            ? b.revenue - a.revenue
            : a.revenue - b.revenue;
        });

        // Ograniči na 4 proizvoda
        setProductData(sortedProducts.slice(0, 4));
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchData();
  }, [filterType]);

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    setAnchorEl(null);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        boxShadow: 3,
        minHeight: '480px',
        width: '380px',
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <IconButton
            aria-label='filters'
            aria-controls={open ? 'filter-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            onClick={handleFilterClick}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              px: 1,
            }}
          >
            <Typography variant='body2' sx={{ mr: 1 }}>
              Filters
            </Typography>
            <FilterListIcon fontSize='small' />
          </IconButton>
          <Menu
            id='filter-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'filter-button',
            }}
          >
            <MenuItem onClick={() => handleFilterChange('topRated')}>
              Top Rated
            </MenuItem>
            <MenuItem onClick={() => handleFilterChange('lowestRated')}>
              Lowest Rated
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Stack spacing={2}>
        {productData.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              borderRadius: 2,
              backgroundColor: '#f8f9fa',
              boxShadow: 3,
              '&:hover': {
                backgroundColor: theme.palette.grey[50],
              },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                mr: 2,
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: 24, color: '#555' }} />
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant='body1'
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                }}
              >
                {item.name}
              </Typography>
            </Box>

            <Box
              sx={{ display: 'flex', alignItems: 'center', textAlign: 'right' }}
            >
              <Typography
                variant='body1'
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mr: 0.2,
                }}
              >
                ${item.revenue.toLocaleString()}
              </Typography>
              <Typography
                variant='body2'
                sx={{
                  color: theme.palette.text.secondary,
                  backgroundColor: theme.palette.grey[100],
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  display: 'inline-block',
                }}
              >
                {(
                  (item.revenue /
                    productData.reduce((sum, p) => sum + p.revenue, 0)) *
                  100
                ).toFixed(1)}
                %
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

export default SalesChart;
