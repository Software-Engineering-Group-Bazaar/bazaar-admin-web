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
// Using ShoppingCartIcon from develop as it's generic for product sales
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// API imports from develop
import {
  apiGetAllAdsAsync,
  apiGetAllStoresAsync,
  apiGetStoreProductsAsync,
} from '../api/api.js';

function SalesChart() {
  const theme = useTheme();
  const [filterType, setFilterType] = useState('topRated'); // 'topRated' or 'lowestRated'
  const [anchorEl, setAnchorEl] = useState(null);
  const [productSalesData, setProductSalesData] = useState([]); // Changed from productData to be more specific
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all ads
        const adsResponse = await apiGetAllAdsAsync();
        const ads =
          adsResponse && Array.isArray(adsResponse.data)
            ? adsResponse.data
            : [];

        // Fetch all stores
        const storesResponse = await apiGetAllStoresAsync();
        const stores = Array.isArray(storesResponse) ? storesResponse : [];

        // Create a map of all products from all stores
        const allProductsMap = {};
        for (const store of stores) {
          if (store && store.id) {
            const productsResponse = await apiGetStoreProductsAsync(store.id);
            const storeProducts =
              productsResponse && Array.isArray(productsResponse.data)
                ? productsResponse.data
                : [];
            for (const product of storeProducts) {
              if (product && product.id && !allProductsMap[product.id]) {
                allProductsMap[product.id] = {
                  id: product.id,
                  name: product.name || `Product ${product.id}`,
                  // imageUrl: product.imageUrl || 'https://via.placeholder.com/40', // If you have image URLs
                  // Placeholder for product-specific icon/color if needed later
                  // icon: ShoppingCartIcon,
                  // color: theme.palette.text.secondary,
                  clicks: 0,
                  conversions: 0,
                  revenue: 0,
                };
              }
            }
          }
        }

        // Process all ads to aggregate sales data per product
        for (const ad of ads) {
          if (ad && Array.isArray(ad.adData)) {
            for (const adDataItem of ad.adData) {
              if (
                adDataItem &&
                adDataItem.productId &&
                allProductsMap[adDataItem.productId]
              ) {
                const productEntry = allProductsMap[adDataItem.productId];
                productEntry.clicks += ad.clicks || 0;
                productEntry.conversions += ad.conversions || 0;
                productEntry.revenue +=
                  (ad.conversions || 0) * (ad.conversionPrice || 0);
              }
            }
          }
        }

        // Sort products based on filterType (revenue)
        let sortedProductsArray = Object.values(allProductsMap);

        if (filterType === 'topRated') {
          sortedProductsArray.sort((a, b) => b.revenue - a.revenue);
        } else {
          // 'lowestRated'
          // Filter out products with zero revenue for "lowest rated" to make it meaningful
          sortedProductsArray = sortedProductsArray.filter(
            (p) => p.revenue > 0
          );
          sortedProductsArray.sort((a, b) => a.revenue - b.revenue);
        }

        // Limit to top/lowest 4 products (or adjust as needed)
        setProductSalesData(sortedProductsArray.slice(0, 4));
      } catch (error) {
        console.error('Error fetching product sales data:', error);
        setProductSalesData([]); // Reset on error
      }
    };

    fetchData();
  }, [filterType]); // Re-fetch when filterType changes

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    handleClose(); // Also close the menu
  };

  const totalRevenueAllDisplayed = productSalesData.reduce(
    (sum, p) => sum + p.revenue,
    0
  );

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        // Using dimensions from develop for consistency in a dashboard
        minHeight: '480px',
        width: '380px',
        backgroundColor: '#fff', // White background from develop
        borderRadius: 2,
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Consistent shadow
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
        {/* Filter Button and Menu - structure from develop is fine */}
        <Box>
          <IconButton
            aria-label='filters' // aria-label from HEAD
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
        {productSalesData.length === 0 && (
          <Typography
            sx={{
              textAlign: 'center',
              color: theme.palette.text.secondary,
              mt: 4,
            }}
          >
            No product sales data to display for this filter.
          </Typography>
        )}
        {productSalesData.map((item) => {
          // Dynamic percentage calculation from develop
          const percentage =
            totalRevenueAllDisplayed > 0
              ? ((item.revenue / totalRevenueAllDisplayed) * 100).toFixed(1)
              : '0.0';

          return (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                borderRadius: 2,
                backgroundColor: '#f8f9fa', // Item background from develop
                boxShadow: 1, // Subtle shadow for items
                '&:hover': {
                  backgroundColor: theme.palette.grey[100], // Slightly darker hover
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
                  backgroundColor: '#fff', // Icon background circle
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  mr: 2,
                }}
              >
                {/* Using generic ShoppingCartIcon from develop.
                    If item had specific icon data, could use React.createElement here. */}
                <ShoppingCartIcon
                  sx={{ fontSize: 22, color: theme.palette.primary.main }}
                />
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant='body1'
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                  }}
                  noWrap // Prevent long names from breaking layout
                  title={item.name}
                >
                  {item.name.length > 16
                    ? `${item.name.substring(0, 16)}...`
                    : item.name}{' '}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textAlign: 'right',
                  ml: 1,
                }}
              >
                <Typography
                  variant='body1'
                  sx={{
                    fontWeight: 600, // Slightly less bold than develop's 700, more like HEAD's 600
                    color: theme.palette.text.primary,
                    mr: 1, // Increased margin for readability
                  }}
                >
                  ${item.revenue.toLocaleString()}
                </Typography>
                <Typography
                  variant='caption' // Using caption for percentage for better hierarchy
                  sx={{
                    color: theme.palette.text.secondary,
                    backgroundColor: theme.palette.grey[200], // Adjusted background for caption
                    px: 0.8,
                    py: 0.3,
                    borderRadius: 1,
                    display: 'inline-block',
                    fontWeight: 500,
                    minWidth: '40px', // Ensure percentage has some space
                    textAlign: 'center',
                  }}
                >
                  {percentage}%
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}

export default SalesChart;
