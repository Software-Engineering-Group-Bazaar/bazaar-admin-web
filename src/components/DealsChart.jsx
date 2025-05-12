import React, { useState, useRef, useEffect } from 'react'; // Merged: useEffect from develop
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Paper, // Ensured Paper is present
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FilterListIcon from '@mui/icons-material/FilterList';
import StoreIcon from '@mui/icons-material/Store';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { apiGetAllStoresAsync, apiGetAllAdsAsync } from '../api/api.js'; // From develop

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

function DealsChart() {
  const [filterType, setFilterType] = useState('topRated'); // 'topRated' or 'lowestRated'
  const [anchorEl, setAnchorEl] = useState(null);
  const [storesData, setStoresData] = useState({
    topRated: [],
    lowestRated: [],
  }); // From develop, initialized
  const [barPositions, setBarPositions] = useState([]); // From develop
  const open = Boolean(anchorEl);
  const chartRef = useRef(null);
  const containerRef = useRef(null); // From develop

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storesResponse, adsResponse] = await Promise.all([
          apiGetAllStoresAsync(),
          apiGetAllAdsAsync(),
        ]);

        const stores = Array.isArray(storesResponse) ? storesResponse : [];
        const ads =
          adsResponse && Array.isArray(adsResponse.data)
            ? adsResponse.data
            : [];

        const storeMap = {};
        stores.forEach((store) => {
          if (store && store.id) {
            // Ensure store and store.id exist
            storeMap[store.id] = store.name || `Store ${store.id}`; // Use name or fallback
          }
        });

        const revenueByStore = {};
        ads.forEach((ad) => {
          if (!ad || !ad.conversionPrice || ad.conversionPrice === 0) return;
          if (ad.adData && Array.isArray(ad.adData)) {
            ad.adData.forEach((adDataItem) => {
              if (!adDataItem || !adDataItem.storeId) return; // Ensure adDataItem and storeId exist
              const storeId = adDataItem.storeId;
              if (!storeMap[storeId]) return;
              const revenue = (ad.conversionPrice || 0) * (ad.conversions || 0);
              revenueByStore[storeId] =
                (revenueByStore[storeId] || 0) + revenue;
            });
          }
        });

        const sortedStoresData = Object.entries(revenueByStore)
          .map(([storeId, amount]) => ({
            id: storeId,
            name: storeMap[storeId] || `Store ${storeId}`, // Fallback name
            amount,
          }))
          .sort((a, b) => b.amount - a.amount); // Sort descending by amount

        const topRated = sortedStoresData.slice(0, 5);
        // For lowest rated, take the last 5 (smallest amounts) and then sort them ascending for display
        const lowestRated = sortedStoresData
          .slice(-5)
          .sort((a, b) => a.amount - b.amount);

        setStoresData({
          topRated,
          lowestRated,
        });
      } catch (error) {
        console.error('Failed to fetch deals data:', error);
        setStoresData({ topRated: [], lowestRated: [] }); // Reset on error
      }
    };

    fetchData();
  }, []);

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    handleClose();
    setBarPositions([]); // Reset bar positions when filter changes
  };

  const currentDisplayData = storesData[filterType] || [];

  const chartData = {
    labels: currentDisplayData.map((item) => item.name), // Use store names for labels
    datasets: [
      {
        data: currentDisplayData.map((item) => item.amount),
        backgroundColor: '#353535', // Darker bars from develop
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 24, // More rounded bars from develop
        barThickness: 55, // Bar thickness from develop
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            return `$${context.raw.toLocaleString()}`;
          },
          title: function (context) {
            // Tooltip title from develop
            return context && context[0] ? context[0].label : '';
          },
        },
      },
    },
    scales: {
      x: {
        display: false, // Hiding x-axis labels as info is on icons/tooltips
        grid: { display: false },
      },
      y: {
        display: false, // Hiding y-axis
        grid: { display: false },
        beginAtZero: true, // Important for bar charts
      },
    },
    animation: {
      // For calculating icon positions from develop
      onComplete: function () {
        if (chartRef.current) {
          const chart = chartRef.current;
          const meta = chart.getDatasetMeta(0);
          const newPositions = [];

          if (meta && meta.data && meta.data.length > 0) {
            meta.data.forEach((bar) => {
              newPositions.push({
                top: bar.y, // y-coordinate of the top of the bar
                left: bar.x, // x-coordinate of the center of the bar
                // width: bar.width, // not strictly needed for icon positioning here
              });
            });
            // Only update if positions actually changed to prevent potential loops
            if (
              newPositions.length !== barPositions.length ||
              newPositions.some(
                (p, i) =>
                  p.top !== barPositions[i]?.top ||
                  p.left !== barPositions[i]?.left
              )
            ) {
              setBarPositions(newPositions);
            }
          } else if (barPositions.length > 0) {
            // If no data, clear positions
            setBarPositions([]);
          }
        }
      },
      duration: 300, // Give a small duration for animation to complete
    },
    layout: {
      // Padding from HEAD, adjusted
      padding: { top: 30, bottom: 10, left: 10, right: 10 },
    },
  };

  const chartHeight = 250;

  return (
    <Paper
      elevation={3} // Elevation from develop for shadow
      sx={{
        p: 3,
        height: '480px', // Fixed height from develop
        width: '380px', // Fixed width from develop
        backgroundColor: '#fff', // White background from develop
        borderRadius: 2,
        position: 'relative', // For absolute positioning of icons
      }}
      ref={containerRef} // From develop
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: 2,
        }}
      >
        <IconButton
          aria-label='filters' // Accessibility from HEAD
          aria-controls={open ? 'filter-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleFilterClick}
          sx={{
            // Styling from develop
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            px: 1,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
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

      <Box sx={{ height: chartHeight, position: 'relative' }}>
        <Bar ref={chartRef} data={chartData} options={chartOptions} />

        {/* Icons on top of bars - logic from develop */}
        {currentDisplayData.length > 0 &&
          barPositions.length === currentDisplayData.length &&
          barPositions.map((pos, index) => {
            const item = currentDisplayData[index];
            if (!item) return null;

            let iconBackgroundColor;
            if (filterType === 'topRated') {
              if (index === 0)
                iconBackgroundColor = '#FFD700'; // Gold
              else if (index === 1)
                iconBackgroundColor = '#C0C0C0'; // Silver
              else if (index === 2)
                iconBackgroundColor = '#CD7F32'; // Bronze
              else iconBackgroundColor = '#B4D4C3'; // Neutral
            } else {
              // Lowest Rated (currentDisplayData is sorted ascending for 'lowestRated')
              if (index === 0)
                iconBackgroundColor = '#f44336'; // Lowest
              else if (index === 1)
                iconBackgroundColor = '#E57373'; // 2nd Lowest
              else if (index === 2)
                iconBackgroundColor = '#FFB74D'; // 3rd Lowest
              else iconBackgroundColor = '#B4D4C3'; // Neutral
            }

            return (
              <Box
                key={item.id}
                sx={{
                  position: 'absolute',
                  top: pos.top + 8, // Position icon slightly offset from the top of the bar (develop's style)
                  left: pos.left, // Center horizontally on the bar
                  transform: 'translateX(-50%)', // Adjust for icon's own width
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: iconBackgroundColor,
                  color: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  zIndex: 2,
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <StoreIcon sx={{ fontSize: 18 }} />
              </Box>
            );
          })}
      </Box>

      {/* Text at the bottom - "by store" from develop */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant='body1' sx={{ fontWeight: 'medium' }}>
          Deals amount
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant='body2' color='text.secondary'>
            by store
          </Typography>
          <KeyboardArrowDownIcon
            fontSize='small'
            sx={{ color: 'text.secondary', ml: 0.5 }}
          />
        </Box>
      </Box>
    </Paper>
  );
}

export default DealsChart;
