
import React, { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  Divider,
  TextField,
  Chip,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FaPen, FaCheck } from 'react-icons/fa';
import OrderItemCard from './OrderItemCard';
import {
  apiUpdateOrderAsync,
  apiGetAllStoresAsync,
  apiFetchApprovedUsersAsync,
} from '@api/api';

const statusOptions = [
  'Requested',
  'Confirmed',
  'Rejected',
  'Ready',
  'Sent',
  'Delivered',
  'Cancelled',
];

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return '#0288d1';
    case 'rejected':
      return '#d32f2f';
    case 'ready':
      return '#388e3c';
    case 'sent':
      return '#fbc02d';
    case 'delivered':
      return '#1976d2';
    case 'cancelled':
      return '#b71c1c';
    case 'requested':
      return '#757575';
    default:
      return '#9e9e9e';
  }
};

const OrderComponent = ({ open, onClose, narudzba, onOrderUpdated }) => {
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState(narudzba.status);
  const [buyerId, setBuyerId] = useState(null);
  const [storeId, setStoreId] = useState(null);
  const [buyerName] = useState(narudzba.buyerId);
  const [storeName] = useState(narudzba.storeId);
  const [date, setDate] = useState(
    new Date(narudzba.time).toISOString().slice(0, 16)
  );
  const [products, setProducts] = useState(narudzba.proizvodi || []);
  const [deliveryAddress] = useState(narudzba.deliveryAddress);
  const [receivingAddress] = useState(narudzba.receivingAddress);

  useEffect(() => {
    const fetchMappings = async () => {
      const [stores, users] = await Promise.all([
        apiGetAllStoresAsync(),
        apiFetchApprovedUsersAsync(),
      ]);

      const storeEntry = stores.find((s) => s.name === narudzba.storeId);
      const userEntry = users.find(
        (u) => u.userName === narudzba.buyerId || u.email === narudzba.buyerId
      );

      if (storeEntry) setStoreId(storeEntry.id);
      if (userEntry) setBuyerId(userEntry.id);
    };

    fetchMappings();
  }, [narudzba.buyerId, narudzba.storeId]);

  const handleProductChange = (index, changes) => {
    setProducts((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...changes } : item))
    );
  };

  const total = useMemo(() => {
    return products.reduce(
      (sum, p) => sum + parseFloat(p.price || 0) * parseInt(p.quantity || 0),
      0
    );
  }, [products]);

  const handleSaveChanges = async () => {
    const originalOrderItems = narudzba.orderItems || [];

    if (originalOrderItems.length !== products.length) {
      alert('Greška: broj proizvoda se ne poklapa.');
      return;
    }

    if (!storeId) {
      alert('Greška: Store ID nije validan.');
      return;
    }

    if (!buyerId) {
      alert('Greška: Buyer ID nije validan.');
      return;
    }

    const payload = {
      buyerId: String(buyerId),
      storeId,
      status,
      time: new Date(date).toISOString(),
      total,
      orderItems: products.map((p, i) => {
        const original = originalOrderItems[i];
        return {
          id: Number(original.id),
          productId: Number(original.productId),
          price: Number(p.price),
          quantity: Number(p.quantity),
        };
      }),
      deliveryAddressId: deliveryAddress?.id,
      receivingAddressId: receivingAddress?.id,
    };

    const res = await apiUpdateOrderAsync(narudzba.id, payload);

    if (res.success) {
      setEditMode(false);
      onClose();
      window.location.reload();
    } else {
      alert('Neuspješno ažuriranje narudžbe.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='xs'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 6,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#ffffff',
          boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 0,
          top: 0,
          left: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 180,
            height: 180,
            backgroundColor: '#f9d976',
            opacity: 0.6,
            borderRadius: '50%',
            top: -40,
            left: -40,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 140,
            height: 140,
            backgroundColor: '#f6c343',
            opacity: 0.5,
            borderRadius: '50%',
            bottom: -25,
            right: -25,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 90,
            height: 90,
            backgroundColor: '#d1d5db',
            opacity: 0.4,
            borderRadius: '50%',
            bottom: 60,
            left: -20,
          }}
        />
      </Box>

      <DialogContent
        sx={{ position: 'relative', zIndex: 1, px: 3, pt: 3, pb: 4 }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1,
            width: 36,
            height: 36,
            padding: 2,
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <Box
          display='flex'
          alignItems='center'
          mb={2}
          zIndex={1}
          position='relative'
        >
          <Typography
            variant='h5'
            fontWeight={800}
            sx={{ color: '#1f2937', mr: 1 }}
          >
            {`${buyerName}'s Order`}
          </Typography>
          <IconButton
            onClick={() => setEditMode(!editMode)}
            sx={{ color: '#6b7280', p: 0.5 }}
          >
            {editMode ? <FaCheck size={14} /> : <FaPen size={14} />}
          </IconButton>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            mb: 3,
            pr: 1,
          }}
        >
          {products.map((item, idx) => (
            <Box
              key={idx}
              sx={{ mt: 1, mb: idx !== products.length - 1 ? 1.5 : 0 }}
            >
              <OrderItemCard
                name={item.name}
                price={item.price}
                quantity={item.quantity}
                imageUrl={item.imageUrl}
                tagIcon={item.tagIcon}
                tagLabel={item.tagLabel}
                isEditable={editMode}
                onChange={(updated) => handleProductChange(idx, updated)}
              />
            </Box>
          ))}
        </Box>

        <Box mb={2}>
          <Typography fontWeight={700} mb={2} fontSize='1rem' color='#4a0404'>
            Order Info
          </Typography>

          <Box display='flex' justifyContent='space-between' mb={1}>
            <Typography color='text.secondary'>Order ID:</Typography>
            <Typography fontWeight={600}>{narudzba.id}</Typography>
          </Box>

          <Box display='flex' justifyContent='space-between' mb={1}>
            <Typography color='text.secondary'>Buyer:</Typography>
            <Typography fontWeight={600}>{buyerName}</Typography>
          </Box>

          <Box display='flex' justifyContent='space-between' mb={1}>
            <Typography color='text.secondary'>Store:</Typography>
            <Typography fontWeight={600}>{storeName}</Typography>
          </Box>

          <Box display='flex' justifyContent='space-between' mb={1}>
            <Typography color='text.secondary'>Status:</Typography>
            {editMode ? (
              <TextField
                select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                variant='standard'
                sx={{ minWidth: 120 }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <Chip
                label={status}
                size='small'
                sx={{
                  backgroundColor: getStatusColor(status),
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  px: 1,
                  height: '24px',
                  borderRadius: '10px',
                  textTransform: 'capitalize',
                }}
              />
            )}
          </Box>

          <Box display='flex' justifyContent='space-between' mb={1}>
            <Typography color='text.secondary'>Date:</Typography>
            {editMode ? (
              <TextField
                variant='standard'
                type='datetime-local'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                sx={{ ml: 2 }}
              />
            ) : (
              <Typography fontWeight={500}>
                {new Date(narudzba.time).toLocaleString()}
              </Typography>
            )}
          </Box>

          <Box display='flex' justifyContent='space-between' mb={1}>
            <Typography color='text.secondary'>Delivery Address:</Typography>
            <Box textAlign='right'>
              <Typography fontWeight={600}>
                {deliveryAddress?.address}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {deliveryAddress?.city}
              </Typography>
            </Box>
          </Box>

          <Box display='flex' justifyContent='space-between' mb={1}>
            <Typography color='text.secondary'>Receiving Address:</Typography>
            <Box textAlign='right'>
              <Typography fontWeight={600}>
                {receivingAddress?.address}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {receivingAddress?.city}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mt={2}
        >
          <Typography fontWeight={700} fontSize='1.2rem' color='green'>
            Total
          </Typography>
          <Typography fontWeight={700} fontSize='1.2rem' color='green'>
            ${total.toFixed(2)}
          </Typography>
        </Box>

        <Button
          fullWidth
          variant='contained'
          onClick={handleSaveChanges}
          sx={{
            mt: 4,
            py: 1.6,
            borderRadius: 99,
            fontWeight: 700,
            fontSize: '1rem',
            background: 'linear-gradient(to right, #fbbc05, #f6c343)',
            color: '#000',
          }}
        >
          Save Changes
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default OrderComponent;
