import React, { useState, useMemo } from 'react';
import { Box, Tabs, Tab, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Sidebar from '@components/Sidebar';
import OrdersTable from '../components/OrdersTable';
import OrderDetailsPopup from '../components/OrderComponent'; 

const OrdersSection = () => {
  const [tabValue, setTabValue] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split('-');
    setSortField(field);
    setSortOrder(order);
  };

  const orders = [
    {
      id: 1,
      status: "cancelled",
      buyerId: 101,
      storeId: 201,
      deliveryAddress: "123 Street, New York",
      createdAt: "2024-04-18T12:00:00",
      totalPrice: 120,
      products: [
        { price: 40, quantity: 2 },
        { price: 20, quantity: 2 },
      ],
      isCancelled: true,
    },
    {
      id: 2,
      status: "active",
      buyerId: 102,
      storeId: 202,
      deliveryAddress: "456 Avenue, Chicago",
      createdAt: "2024-04-15T09:30:00",
      totalPrice: 80,
      products: [
        { price: 80, quantity: 1 },
      ],
      isCancelled: false,
    }
  ];

  const filteredOrders = useMemo(() => {
    if (tabValue === 'active') {
      return orders.filter((order) => !order.isCancelled);
    } else if (tabValue === 'cancelled') {
      return orders.filter((order) => order.isCancelled);
    } else {
      return orders;
    }
  }, [orders, tabValue]);

  return (
    <Box sx={{ display: 'flex', width: '100%', backgroundColor: '#fefefe', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, width: '100%', maxWidth: '1400px', marginLeft: '260px', pt: 2, px: 2 }}>
        <h1 className="text-2xl font-bold mb-4">Orders</h1>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="secondary">
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

        {/* Tabela narudžbi */}
        <OrdersTable
          orders={filteredOrders}
          sortField={sortField}
          sortOrder={sortOrder}
          onOrderClick={(order) => setSelectedOrder(order)}
        />

        {/* Popup za detalje narudžbe */}
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
              cijeneProizvoda: selectedOrder.products.map(p => p.price),
              kolicineProizvoda: selectedOrder.products.map(p => p.quantity),
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
