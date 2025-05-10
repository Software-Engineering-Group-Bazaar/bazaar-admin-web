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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

const initialData = [
  { id: 1, name: 'Dribbble', amount: 85000, color: '#ea4c89' },
  { id: 2, name: 'Behance', amount: 72000, color: '#0057ff' },
  { id: 3, name: 'Google', amount: 65000, color: '#4285F4' },
  { id: 4, name: 'Instagram', amount: 52000, color: '#E1306C' },
  { id: 5, name: 'Store', amount: 45000, color: '#627eea' },
];

const lowestRatedData = [
  { id: 6, name: 'Twitter', amount: 15000, color: '#1DA1F2' },
  { id: 7, name: 'Facebook', amount: 12000, color: '#4267B2' },
  { id: 8, name: 'LinkedIn', amount: 9000, color: '#0A66C2' },
  { id: 9, name: 'Pinterest', amount: 7000, color: '#E60023' },
  { id: 10, name: 'TikTok', amount: 5000, color: '#000000' },
];

function DealsChart() {
  const [filterType, setFilterType] = useState('topRated');
  const [anchorEl, setAnchorEl] = useState(null);
  const [barPositions, setBarPositions] = useState([]);
  const open = Boolean(anchorEl);
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  const data = filterType === 'topRated' ? initialData : lowestRatedData;

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

  // Update bar positions when the chart renders
  useEffect(() => {
    const updateBarPositions = () => {
      if (chartRef.current) {
        const chart = chartRef.current;

        // Check if chart metadata is available
        if (chart && chart.chartArea && chart.scales.x) {
          const newPositions = [];

          // Get each bar's position from the chart
          const meta = chart.getDatasetMeta(0);
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
      }
    };

    // Initial update
    updateBarPositions();

    // Update positions on window resize
    window.addEventListener('resize', updateBarPositions);

    return () => {
      window.removeEventListener('resize', updateBarPositions);
    };
  }, [filterType, data]);

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
        width:'380px',
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
        {/* Icons on top of bars */}
        {barPositions.map((pos, index) => {
          // Sortiraj podatke po amount za rangiranje
          const sortedData = [...data].sort((a, b) => b.amount - a.amount);

          // Dodaj boje za top rated ili lowest rated
          let backgroundColor;
          if (filterType === 'topRated') {
            if (sortedData[index].amount === sortedData[0].amount) {
              backgroundColor = '#FFD700'; // Zlatna za prvi
            } else if (sortedData[index].amount === sortedData[1].amount) {
              backgroundColor = '#C0C0C0'; // Srebrna za drugi
            } else if (sortedData[index].amount === sortedData[2].amount) {
              backgroundColor = '#CD7F32'; // Bronzana za treći
            } else {
              backgroundColor = '#B4D4C3'; // Neutralna za ostale
            }
          } else {
            if (sortedData[index].amount === sortedData[0].amount) {
              backgroundColor = '#f93336'; // Crvena za prvi
            } else if (sortedData[index].amount === sortedData[1].amount) {
              backgroundColor = '#E74C3C'; // Svjetlija crvena za drugi
            } else if (sortedData[index].amount === sortedData[2].amount) {
              backgroundColor = '#ffeb3b'; // Žuta za treći
            } else {
              backgroundColor = '#B4D4C3'; // Neutralna za ostale
            }
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
            by referrer category
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
