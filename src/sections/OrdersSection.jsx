import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Sidebar from '@components/Sidebar';
import OrdersTable from '../components/OrdersTable';
import OrderDetailsPopup from '../components/OrderComponent';
import { apiGetOrdersAsync } from '@api/api';

const OrdersSection = () => {
  const [tabValue, setTabValue] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await apiGetOrdersAsync();
      if (response.status === 200) {
        setOrders(response.data);
      } else {
        console.error('Failed to fetch orders:', response);
      }
    };

    fetchOrders();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split('-');
    setSortField(field);
    setSortOrder(order);
  };

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    if (tabValue === 'active') {
      filtered = filtered.filter((order) => !order.isCancelled);
    } else if (tabValue === 'cancelled') {
      filtered = filtered.filter((order) => order.isCancelled);
    }

    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'createdAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [orders, tabValue, sortField, sortOrder]);

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        backgroundColor: '#fefefe',
        minHeight: '100vh',
      }}
    >
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          width: '100%',
          maxWidth: '1400px',
          marginLeft: '260px',
          pt: 2,
          px: 2,
        }}
      >
        <h1 className="text-2xl font-bold mb-4">Orders</h1>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="secondary"
          >
            <Tab value="all" label="All Orders" />
            <Tab value="active" label="Active Orders" />
            <Tab value="cancelled" label="Cancelled Orders" />
          </Tabs>

          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={`${sortField}-${sortOrder}`}
              label="Sort By"
              onChange={handleSortChange}
            >
              <MenuItem value="createdAt-asc">Date (Min ➔ Max)</MenuItem>
              <MenuItem value="createdAt-desc">Date (Max ➔ Min)</MenuItem>
              <MenuItem value="deliveryAddress-asc">Address (A ➔ Z)</MenuItem>
              <MenuItem value="deliveryAddress-desc">Address (Z ➔ A)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <OrdersTable
          orders={filteredOrders}
          sortField={sortField}
          sortOrder={sortOrder}
          onOrderClick={(order) => setSelectedOrder(order)}
        />

        {selectedOrder && (
          <OrderDetailsPopup
            narudzba={{
              id: selectedOrder.id,
              status: selectedOrder.status,
              kupacId: selectedOrder.buyerId,
              prodavnicaId: selectedOrder.storeId,
              adresa: selectedOrder.deliveryAddress,
              datum: selectedOrder.createdAt,
              ukupnaCijena: selectedOrder.totalPrice,
              cijeneProizvoda: selectedOrder.products.map((p) => p.price),
              kolicineProizvoda: selectedOrder.products.map((p) => p.quantity),
              isCancelled: selectedOrder.isCancelled,
            }}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </Box>
    </Box>
  );
};

export default OrdersSection;
