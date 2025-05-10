import React, { useState, useRef } from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
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
  { id: 1, name: 'Dribbble', amount: 85000 },
  { id: 2, name: 'Behance', amount: 72000 },
  { id: 3, name: 'Google', amount: 65000 },
  { id: 4, name: 'Instagram', amount: 52000 },
  { id: 5, name: 'Store', amount: 45000 }
];

const lowestRatedData = [
  { id: 6, name: 'Twitter', amount: 15000 },
  { id: 7, name: 'Facebook', amount: 12000 },
  { id: 8, name: 'LinkedIn', amount: 9000 },
  { id: 9, name: 'Pinterest', amount: 7000 },
  { id: 10, name: 'TikTok', amount: 5000 }
];

function DealsChart() {
  const theme = useTheme();
  const [filterType, setFilterType] = useState('topRated');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const chartRef = useRef(null);

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

  const getIconColor = (index) => {
    if (filterType === 'topRated') {
      return index === 0 ? '#FFD700' :
        index === 1 ? '#C0C0C0' :
          index === 2 ? '#CD7F32' :
            '#A2CFFE';
    } else {
      return index === 0 ? '#f44336' :
        index === 1 ? '#ff80ab' :
          index === 2 ? '#ffeb3b' :
            '#A2CFFE';
    }
  };

  const chartData = {
    labels: data.map(() => ''),
    datasets: [
      {
        data: data.map(item => item.amount),
        backgroundColor: '#FFFFFF', 
        borderWidth: 0,
        borderRadius: 6,
        barThickness: 50,
        shadowColor: 'rgba(0, 0, 0, 0.3)', 
        shadowBlur: 8, 
        shadowOffsetX: 2, 
        shadowOffsetY: 4, 
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
          }
        }
      },
    },
    scales: {
      x: {
        display: false,
        grid: { display: false }
      },
      y: {
        display: false,
        grid: { display: false },
        ticks: { display: false }
      },
    },
    layout: {
      padding: { top: 40, bottom: 0 }
    },
  };

  const chartHeight = 250; 

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: 'auto',
        backgroundColor: '#F5F5F5',
        borderRadius: 2,
        boxShadow: '0px 2px 6px rgba(0,0,0,0.1)', 
      }}
    >
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        mb: 2
      }}>
        <IconButton
          aria-label="filters"
          aria-controls={open ? 'filter-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleFilterClick}
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            px: 1,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          <Typography variant="body2" sx={{ mr: 1 }}>Filters</Typography>
          <FilterListIcon fontSize="small" />
        </IconButton>
        <Menu
          id="filter-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'filter-button',
          }}
        >
          <MenuItem onClick={() => handleFilterChange('topRated')}>Top Rated</MenuItem>
          <MenuItem onClick={() => handleFilterChange('lowestRated')}>Lowest Rated</MenuItem>
        </Menu>
      </Box>

      <Box sx={{ height: chartHeight, position: 'relative' }}>
        <Bar ref={chartRef} data={chartData} options={chartOptions} />

        
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            px: 3
          }}
        >
          {data.map((item, index) => {
            const maxValue = Math.max(...data.map(d => d.amount));
            const barHeight = (item.amount / maxValue) * chartHeight;

            return (
              <Box
                key={item.id}
                sx={{
                  position: 'relative',
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  boxShadow: '0px 4px 10px rgba(0,0,0,0.15)', 
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: `-8px`, 
                    transform: 'translateX(-50%)',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: getIconColor(index),
                    color: '#fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    zIndex: 2,
                  }}
                >
                  <StoreIcon sx={{ fontSize: 18 }} />
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Typography variant="body1" sx={{ mt: 2, fontWeight: 'medium' }}>
        Deals amount
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          by referrer category
        </Typography>
        <KeyboardArrowDownIcon
          fontSize="small"
          sx={{ color: 'text.secondary', ml: 0.5 }}
        />
      </Box>
    </Paper>
  );
}

export default DealsChart;
