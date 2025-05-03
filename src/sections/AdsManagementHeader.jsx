import React from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const AdsManagementHeader = ({ onCreateAd, searchTerm, setSearchTerm }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        width: '100%',
        py: 3,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        borderBottom: '1px solid #e0e0e0',
        mb: 3,
      }}
    >
      <Box sx={{ textAlign: 'left' }}>
        <Typography variant='h5' fontWeight='bold' color='text.primary'>
          Ads Management
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Admin Panel &gt; Advertisements
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          placeholder='Search Ads'
          size='small'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            borderRadius: 2,
            backgroundColor: '#f9f9f9',
            minWidth: { xs: '100%', sm: '240px' },
          }}
        />
        <Button
          variant='contained'
          onClick={onCreateAd}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            backgroundColor: '#34c759',
            color: '#000',
            '&:hover': {
              backgroundColor: '#28a745',
            },
          }}
        >
          Create Ad
        </Button>
      </Box>
    </Box>
  );
};

export default AdsManagementHeader;
