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
  apiFetchDeliveryAddressByIdAsync,
  apiGetStoreByIdAsync,
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
      try {
        // 1. Dohvati osnovne podatke (paralelno)
        const [ordersData, users, stores, categories] = await Promise.all([
          apiFetchOrdersAsync(), // Vraća ordersData, koji treba da sadrži addressId i storeId
          apiFetchApprovedUsersAsync(), // Vraća listu korisnika
          apiGetAllStoresAsync(), // Vraća listu svih prodavnica (možda bez adrese detalja)
          apiGetProductCategoriesAsync(), // Vraća kategorije proizvoda
        ]);

        const usersMap = Object.fromEntries(
          users.map((u) => [u.id, u.userName || u.email])
        );
        const storesMap = Object.fromEntries(stores.map((s) => [s.id, s.name]));
        const categoryMap = Object.fromEntries(
          categories.map((c) => [c.id, c.name])
        );

        const productsMap = {};
        const allProducts = [];

        for (const store of stores) {
          try {
            const res = await apiGetStoreProductsAsync(store.id);
            if (res.status === 200 && res.data) {
              allProducts.push(...res.data);
            }
          } catch (error) {
            console.error(
              `Failed to fetch products for store ID ${store.id}:`,
              error
            );
          }
        }
        allProducts.forEach((p) => (productsMap[p.id] = p));

        const uniqueStoreIds = [
          ...new Set(
            ordersData
              .map((order) => order.storeId)
              .filter((id) => id !== undefined && id !== null)
          ),
        ];
        const uniqueAddressIds = [
          ...new Set(
            ordersData
              .map((order) => order.addressId)
              .filter((id) => id !== undefined && id !== null)
          ),
        ];

        const storeDetailsPromises = uniqueStoreIds.map((storeId) =>
          apiGetStoreByIdAsync(storeId).catch((err) => {
            console.error(
              `Failed to fetch store details for ID ${storeId}:`,
              err
            );
            return { data: { address: 'N/A', id: storeId } };
          })
        );

        const deliveryAddressPromises = uniqueAddressIds.map((addressId) =>
          apiFetchDeliveryAddressByIdAsync(addressId).catch((err) => {
            console.error(
              `Failed to fetch delivery address for ID ${addressId}:`,
              err
            );
            return { address: 'N/A', id: addressId };
          })
        );

        const [storeDetailsResponses, deliveryAddressResponses] =
          await Promise.all([
            Promise.all(storeDetailsPromises),
            Promise.all(deliveryAddressPromises),
          ]);

        const storeDetailsMap = Object.fromEntries(
          storeDetailsResponses.map((res) => [
            res.data?.id || res.id,
            res.data || res,
          ])
        );
        const deliveryAddressesMap = Object.fromEntries(
          deliveryAddressResponses.map((res) => [
            res.data?.id || res.id,
            res.data || res,
          ])
        );

        console.log('USERS', users);
        console.log('ORDERSData: ', ordersData);
        console.log(
          'ORDERS with Address ID:',
          ordersData.map((o) => ({ id: o.id, addressId: o.addressId }))
        );

        const enrichedOrders = ordersData.map((order) => {
          const storeDetails = storeDetailsMap[order.storeId];
          const deliveryAddressDetails = deliveryAddressesMap[order.addressId];

          const storeName = storesMap[parseInt(order.storeId)] ?? order.storeId; // Koristi storeName iz svih stores lookup-a
          const storeAddress = storeDetails?.address ?? 'N/A'; // Koristi 'address' iz detalja prodavnice

          const deliveryAddress = deliveryAddressDetails?.address ?? 'N/A'; // Koristi 'address' iz detalja adrese dostave

          const enrichedOrderItems = (order.orderItems ?? []).map((item) => {
            const prod = productsMap[item.productId] ?? {};
            const productCategory =
              categoryMap[prod.productCategoryId] ?? 'Unknown Category';

            return {
              ...item,
              name: prod.name ?? `Product ${item.productId}`,
              imageUrl: prod.photos?.[0]?.relativePath
                ? `${import.meta.env.VITE_API_BASE_URL}${prod.photos[0].relativePath}`
                : 'https://via.placeholder.com/80',
              tagIcon: '🏷️',
              tagLabel: productCategory,
            };
          });

          return {
            ...order,
            buyerName: usersMap[order.buyerId] ?? order.buyerId,
            storeName: storeName,
            storeAddress: storeAddress,
            deliveryAddress: deliveryAddress,
            _productDetails: enrichedOrderItems,
            // ...ostali property-ji koje već imaš (status, time, total...)
          };
        });

        // 6. Postavi obogaćene narudžbe u state
        setOrders(enrichedOrders);
      } catch (error) {
        console.error('Failed to fetch initial data for OrdersPage:', error);
      }
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
              deliveryAddress: selectedOrder.deliveryAddress,
              storeAddress: selectedOrder.storeAddress,
              orderItems: selectedOrder.products.map((p) => ({
                id: p.id,
                productId: p.productId,
                price: p.price,
                quantity: p.quantity,
                name: p.name,
              })),
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default OrdersPage;
