import React, { useState, useMemo, useEffect } from 'react';
import { Box } from '@mui/material';
import Sidebar from '@components/Sidebar';
import OrdersTable from '../components/OrdersTable';
import OrderDetailsPopup from '../components/OrderComponent';
import OrdersHeader from '@sections/OrdersHeader';
import UserManagementPagination from '@components/UserManagementPagination';
import {
  apiFetchOrdersAsync,
  apiFetchApprovedUsersAsync,
  apiGetAllStoresAsync,
  apiDeleteOrderAsync,
  apiGetProductCategoriesAsync,
  apiGetStoreProductsAsync,
} from '@api/api';

const OrdersPage = () => {
  const [tabValue, setTabValue] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const [ordersData, users, stores, categories] = await Promise.all([
        apiFetchOrdersAsync(),
        apiFetchApprovedUsersAsync(),
        apiGetAllStoresAsync(),
        apiGetProductCategoriesAsync(),
      ]);

      const allProducts = [];
      for (const store of stores) {
        const res = await apiGetStoreProductsAsync(store.id);
        if (res.status === 200) {
          allProducts.push(...res.data);
        }
      }

      const usersMap = Object.fromEntries(
        users.map((u) => [u.id, u.userName || u.email])
      );
      const storesMap = Object.fromEntries(stores.map((s) => [s.id, s.name]));
      const productsMap = Object.fromEntries(allProducts.map((p) => [p.id, p]));
      const categoryMap = Object.fromEntries(
        categories.map((c) => [c.id, c.name])
      );

      console.log(ordersData);

      const enrichedOrders = ordersData.map((order) => ({
        ...order,
        buyerName: usersMap[order.buyerName] ?? order.buyerName,
        storeName: storesMap[parseInt(order.storeName)] ?? order.storeName,
        _productDetails: (order.products ?? []).map((p) => {
          const prod = productsMap[p.productId] ?? {};
          return {
            name: prod.name ?? `Product ${p.productId}`,
            quantity: p.quantity,
            price: p.price,
            imageUrl: prod.photos?.[0]
              ? `${import.meta.env.VITE_API_BASE_URL}${prod.photos[0]}`
              : 'https://via.placeholder.com/80',

            tagIcon: '🏷️',
            tagLabel: prod.productCategory?.name ?? 'Unknown Category',
          };
        }),
      }));

      setOrders(enrichedOrders);
    };

    fetchData();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    const res = await apiDeleteOrderAsync(orderId);
    if (res.status === 204) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } else {
      alert('Failed to delete order.');
    }
  };

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
            onDelete={handleDeleteOrder}
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
              proizvodi: selectedOrder._productDetails,
              orderItems: selectedOrder.products.map((p) => ({
                id: p.id,
                productId: p.productId,
                price: p.price,
                quantity: p.quantity,
                name: p.name, // ✅ neophodno za match po imenu
              })),
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default OrdersPage;
