// src/pages/OrdersPage.jsx
import React, { useState } from 'react';
import { Box } from '@mui/material';
import OrdersTable from '../components/OrdersTable';

const OrdersPage = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  return (
    <Box sx={{ width: '100%', backgroundColor: '#fefefe', minHeight: '100vh' }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: '1400px',
          marginLeft: '260px',
          pt: 2,
          px: 2,
        }}
      >
        <h1 className="text-2xl font-bold mb-4">Narudžbe</h1>

        {/* Filteri */}
        <div className="flex gap-4 mb-6">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">Sve narudžbe</option>
            <option value="cancelled">Otkazane</option>
            <option value="active">Aktivne</option>
          </select>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="date">Sortiraj po datumu</option>
            <option value="address">Sortiraj po adresi</option>
            <option value="status">Sortiraj po statusu</option>
          </select>
        </div>

        <OrdersTable filter={filter} sortBy={sortBy} />
      </Box>
    </Box>
  );
};

export default OrdersPage;
