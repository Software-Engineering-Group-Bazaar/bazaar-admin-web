import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Paper,
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
import { apiGetAllStoresAsync, apiGetAllAdsAsync } from '../api/api.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

function DealsChart() {
  const [filterType, setFilterType] = useState('topRated');
  const [anchorEl, setAnchorEl] = useState(null);
  const [barPositions, setBarPositions] = useState([]);
  const [storesData, setStoresData] = useState([]);
  const open = Boolean(anchorEl);
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const [stores, adsResponse] = await Promise.all([
        apiGetAllStoresAsync(),
        apiGetAllAdsAsync(),
      ]);
      const ads = adsResponse.data;

      const storeMap = {};
      stores.forEach((store) => {
        storeMap[store.id] = store.name;
      });

      const revenueByStore = {};
      ads.forEach((ad) => {
        if (!ad.conversionPrice || ad.conversionPrice === 0) return;
        ad.adData.forEach((adDataItem) => {
          const storeId = adDataItem.storeId;
          if (!storeMap[storeId]) return;
          const revenue = ad.conversionPrice * ad.conversions;
          revenueByStore[storeId] = (revenueByStore[storeId] || 0) + revenue;
        });
      });

      const sortedStores = Object.entries(revenueByStore)
        .map(([storeId, amount]) => ({
          id: storeId,
          name: storeMap[storeId],
          amount,
        }))
        .sort((a, b) => b.amount - a.amount);

      const topRated = sortedStores.slice(0, 5);
      const lowestRated = sortedStores.slice(-5);

      setStoresData({
        topRated,
        lowestRated,
      });
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
  };

  const data = storesData[filterType] || [];

  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.amount),
        backgroundColor: '#353535',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 24,
        barThickness: 55,
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
            return context[0].label;
          },
        },
      },
    },
    scales: {
      x: {
        display: false,
        grid: { display: false },
      },
      y: {
        display: false,
        grid: { display: false },
        beginAtZero: true,
      },
    },
    animation: {
      onComplete: function () {
        if (chartRef.current) {
          const chart = chartRef.current;
          const meta = chart.getDatasetMeta(0);
          const newPositions = [];

          if (meta && meta.data) {
            meta.data.forEach((bar, index) => {
              const barTop = bar.y;
              const barLeft = bar.x;
              const barWidth = bar.width;

              newPositions.push({
                top: barTop,
                left: barLeft,
                width: barWidth,
              });
            });

            setBarPositions(newPositions);
          }
        }
      },
    },
  };

  const chartHeight = 250;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        height: '480px',
        width: '380px',
        backgroundColor: '#fff',
        borderRadius: 2,
        position: 'relative',
      }}
      ref={containerRef}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: 2,
        }}
      >
        <IconButton
          aria-controls={open ? 'filter-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleFilterClick}
          sx={{
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

        {/* Icons on top of bars */}
        {barPositions.map((pos, index) => {
          // Obrni logiku sortiranja za lowestRated
          const sortedData = [...data].sort((a, b) =>
            filterType === 'topRated'
              ? b.amount - a.amount
              : a.amount - b.amount
          );

          let backgroundColor;
          if (filterType === 'topRated') {
            if (index === 0)
              backgroundColor = '#FFD700'; // Gold
            else if (index === 1)
              backgroundColor = '#C0C0C0'; // Silver
            else if (index === 2)
              backgroundColor = '#CD7F32'; // Bronze
            else backgroundColor = '#B4D4C3'; // Neutral
          } else {
            // Obrnuto rangiranje za lowest rated
            const reverseIndex = sortedData.length - 1 - index;
            if (reverseIndex === 0)
              backgroundColor = '#f93336'; // Dark Red for lowest
            else if (reverseIndex === 1)
              backgroundColor = '#E74C3C'; // Lighter Red
            else if (reverseIndex === 2)
              backgroundColor = '#f39c12'; // Yellow for third lowest
            else backgroundColor = '#B4D4C3'; // Neutral
          }

          return (
            <Box
              key={data[index].id}
              sx={{
                position: 'absolute',
                top: pos.top + 8,
                left: pos.left,
                transform: 'translateX(-50%)',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: backgroundColor,
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

      <Box sx={{ mt: 4 }}>
        <Typography variant='body1' sx={{ fontWeight: 'medium' }}>
          Deals amount
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
