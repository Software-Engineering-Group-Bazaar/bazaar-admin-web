import React, { useState, useMemo, useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import Sidebar from '@components/Sidebar';
import OrdersTable from '../components/OrdersTable';
import OrderDetailsPopup from '../components/OrderComponent';
import OrdersHeader from '@sections/OrdersHeader';
import UserManagementPagination from '@components/UserManagementPagination';

const OrdersPage = () => {
  const [tabValue, setTabValue] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const orders = [
    {
      id: 1,
      status: 'active',
      buyerName: 'Tarik',
      storeName: 'Konzum',
      deliveryAddress: '456 Avenue, Chicago',
      createdAt: '2024-04-15T09:30:00',
      totalPrice: 80,
      isCancelled: false,
      products: [{ price: 80, quantity: 1 }],
    },
    {
      id: 2,
      status: 'cancelled',
      buyerName: 'Mahir',
      storeName: 'Amko',
      deliveryAddress: '123 Street, New York',
      createdAt: '2024-04-18T12:00:00',
      totalPrice: 120,
      isCancelled: true,
      products: [
        { price: 40, quantity: 2 },
        { price: 20, quantity: 2 },
      ],
    },
    {
      id: 3,
      status: 'requested',
      buyerName: 'Hana',
      storeName: 'Bauhaus',
      deliveryAddress: 'Tool Road, Munich',
      createdAt: '2024-04-17T14:00:00',
      totalPrice: 40,
      isCancelled: false,
      products: [{ price: 20, quantity: 2 }],
    },
    {
      id: 4,
      status: 'delivered',
      buyerName: 'Ajla',
      storeName: 'Bingo',
      deliveryAddress: 'Bingo Lane, LA',
      createdAt: '2024-04-10T10:15:00',
      totalPrice: 55,
      isCancelled: false,
      products: [{ price: 55, quantity: 1 }],
    },
    {
      id: 5,
      status: 'ready',
      buyerName: 'Faris',
      storeName: 'Hoše',
      deliveryAddress: 'Hoše Drive, Mostar',
      createdAt: '2024-04-11T09:00:00',
      totalPrice: 65,
      isCancelled: false,
      products: [{ price: 65, quantity: 1 }],
    },
    {
      id: 6,
      status: 'sent',
      buyerName: 'Lejla',
      storeName: 'DM',
      deliveryAddress: 'Beauty St, Vienna',
      createdAt: '2024-04-12T11:30:00',
      totalPrice: 85,
      isCancelled: false,
      products: [{ price: 85, quantity: 1 }],
    },
    {
      id: 7,
      status: 'confirmed',
      buyerName: 'Nedim',
      storeName: 'Interex',
      deliveryAddress: 'Center Blvd, Sarajevo',
      createdAt: '2024-04-13T15:30:00',
      totalPrice: 95,
      isCancelled: false,
      products: [{ price: 95, quantity: 1 }],
    },
    {
      id: 8,
      status: 'cancelled',
      buyerName: 'Sara',
      storeName: 'Robot',
      deliveryAddress: 'Green Way, Tuzla',
      createdAt: '2024-04-14T12:00:00',
      totalPrice: 100,
      isCancelled: true,
      products: [{ price: 50, quantity: 2 }],
    },
    {
      id: 9,
      status: 'active',
      buyerName: 'Adnan',
      storeName: 'Amko',
      deliveryAddress: 'Amko Drive, Zenica',
      createdAt: '2024-04-16T08:30:00',
      totalPrice: 110,
      isCancelled: false,
      products: [{ price: 110, quantity: 1 }],
    },
    {
      id: 10,
      status: 'ready',
      buyerName: 'Ajla',
      storeName: 'Bingo',
      deliveryAddress: 'Bingo Road, LA',
      createdAt: '2024-04-17T13:45:00',
      totalPrice: 130,
      isCancelled: false,
      products: [{ price: 65, quantity: 2 }],
    },
    {
      id: 11,
      status: 'active',
      buyerName: 'Adnan',
      storeName: 'Amko',
      deliveryAddress: 'Amko Drive, Zenica',
      createdAt: '2024-04-16T08:30:00',
      totalPrice: 110,
      isCancelled: false,
      products: [{ price: 110, quantity: 1 }],
    },
    {
      id: 12,
      status: 'ready',
      buyerName: 'Ajla',
      storeName: 'Bingo',
      deliveryAddress: 'Bingo Road, LA',
      createdAt: '2024-04-17T13:45:00',
      totalPrice: 130,
      isCancelled: false,
      products: [{ price: 65, quantity: 2 }],
    },
  ];

  const filteredOrders = useMemo(() => {
    const filteredByTab =
      tabValue === 'all'
        ? orders
        : orders.filter((order) =>
            tabValue === 'cancelled' ? order.isCancelled : !order.isCancelled
          );

    return filteredByTab
      .filter((order) =>
        [order.buyerName, order.storeName].some((field) =>
          field?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .filter((order) =>
        statusFilter ? order.status?.toLowerCase() === statusFilter : true
      );
  }, [orders, tabValue, searchTerm, statusFilter]);

  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      if (sortField === 'createdAt') {
        return sortOrder === 'asc'
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortField === 'id') {
        return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
      }
      return 0;
    });
  }, [filteredOrders, sortField, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedOrders.length / ordersPerPage)
  );
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, tabValue, statusFilter]);

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
        <OrdersHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <Box sx={{ mt: 2 }}>
          <OrdersTable
            orders={currentOrders}
            sortField={sortField}
            sortOrder={sortOrder}
            onSortChange={(field, order) => {
              setSortField(field);
              setSortOrder(order);
            }}
            onOrderClick={(order) => setSelectedOrder(order)}
          />
        </Box>

        <UserManagementPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {selectedOrder && (
          <OrderDetailsPopup
            open={Boolean(selectedOrder)}
            onClose={() => setSelectedOrder(null)}
            narudzba={{
              id: selectedOrder.id,
              buyerId: selectedOrder.buyerName,
              storeId: selectedOrder.storeName,
              status: selectedOrder.status,
              time: selectedOrder.createdAt,
              total: selectedOrder.totalPrice,
              proizvodi: selectedOrder.products.map((p, i) => ({
                name: `Product ${i + 1}`,
                quantity: p.quantity,
                price: p.price,
                imageUrl: 'https://via.placeholder.com/80',
                tagIcon: '🍽️',
                tagLabel: 'Food',
              })),
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default OrdersPage;
