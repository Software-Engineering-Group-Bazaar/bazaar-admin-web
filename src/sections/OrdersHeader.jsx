import React from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

const OrdersHeader = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => {
  const { t } = useTranslation();
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
      }}
    >
      <Box sx={{ textAlign: 'left' }}>
        <Typography variant='h5' fontWeight='bold' color='text.primary'>
          {t('common.orders')}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {t('common.adminPanel')} &gt; {t('common.orders')}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* 🔽 Filter by Status */}
        <FormControl size='small' sx={{ minWidth: 140 }}>
          <InputLabel shrink>{t('common.status')}</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
            label={t('common.status')}
          >
            <MenuItem value=''>{t('common.all')}</MenuItem>
            {[
              'Confirmed',
              'Rejected',
              'Ready',
              'Sent',
              'Delivered',
              'Cancelled',
            ].map((status) => (
              <MenuItem key={status} value={status.toLowerCase()}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 🔍 Search */}
        <TextField
          placeholder={t('common.searchOrders')}
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
      </Box>
    </Box>
  );
};

export default OrdersHeader;
