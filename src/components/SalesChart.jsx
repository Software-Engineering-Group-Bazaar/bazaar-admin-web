import React, { useState } from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  IconButton, 
  Menu, 
  MenuItem,
  Stack,
  useTheme
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import InstagramIcon from '@mui/icons-material/Instagram';
import GoogleIcon from '@mui/icons-material/Google';
import BrushIcon from '@mui/icons-material/Brush';

// Sample data for the chart
const initialData = [
  { 
    id: 1, 
    name: 'Dribbble', 
    amount: 227459, 
    percentage: 43, 
    icon: SportsBasketballIcon,
    color: '#ea4c89'
  },
  { 
    id: 2, 
    name: 'Instagram', 
    amount: 142823, 
    percentage: 27, 
    icon: InstagramIcon,
    color: '#E4405F'
  },
  { 
    id: 3, 
    name: 'Behance', 
    amount: 89935, 
    percentage: 11, 
    icon: BrushIcon,
    color: '#1769ff'
  },
  { 
    id: 4, 
    name: 'Google', 
    amount: 37028, 
    percentage: 7, 
    icon: GoogleIcon,
    color: '#4285F4'
  }
  
];

const lowestRatedData = [
  { 
    id: 5, 
    name: 'Twitter', 
    amount: 15000, 
    percentage: 3, 
    icon: SportsBasketballIcon,
    color: '#1DA1F2'
  },
  { 
    id: 6, 
    name: 'Facebook', 
    amount: 12000, 
    percentage: 2, 
    icon: InstagramIcon,
    color: '#4267B2'
  },
  { 
    id: 7, 
    name: 'LinkedIn', 
    amount: 9000, 
    percentage: 1, 
    icon: BrushIcon,
    color: '#0077B5'
  },
  { 
    id: 8, 
    name: 'Pinterest', 
    amount: 7000, 
    percentage: 1, 
    icon: GoogleIcon,
    color: '#E60023'
  }
];

function SalesChart() {
  const theme = useTheme();
  const [filterType, setFilterType] = useState('topRated');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
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

  return (
    <Paper 
      elevation={3} // Adding shadow to make it look like a card
      sx={{ 
        p: 3, 
        minHeight: '400px', // Ensures the card has a minimum height
        backgroundColor: '#f7f7f7', // Light grey background
        borderRadius: 2,
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)' // Card-like shadow
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Box>
          <IconButton
            aria-label="filters"
            aria-controls={open ? 'filter-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleFilterClick}
            sx={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: 1,
              px: 1
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
        {data.map((item) => (
          <Box 
            key={item.id} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              p: 2,
              borderRadius: 2,
              backgroundColor: 'white', // Card item background color
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Subtle shadow for items
              '&:hover': {
                backgroundColor: theme.palette.grey[50]
              }
            }}
          >
            <Box 
              sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                mr: 2
              }}
            >
              {React.createElement(item.icon, { 
                sx: { 
                  fontSize: 24,
                  color: item.color
                }
              })}
            </Box>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 500,
                  color: theme.palette.text.primary
                }}
              >
                {item.name}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'right' }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mr: 2
                }}
              >
                ${item.amount.toLocaleString()}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  backgroundColor: theme.palette.grey[100],
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  display: 'inline-block'
                }}
              >
                {item.percentage}%
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

export default SalesChart;
