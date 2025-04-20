import React, { useState, useMemo } from 'react';
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
import { apiUpdateOrderAsync, apiUpdateOrderStatusAsync } from '@api/api';

const statusOptions = [
  'requested',
  'confirmed',
  'rejected',
  'ready',
  'sent',
  'delivered',
  'cancelled',
  'active',
];

const OrderComponent = ({ open, onClose, narudzba }) => {
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState(narudzba.status);
  const [buyer, setBuyer] = useState(narudzba.buyerId);
  const [store, setStore] = useState(narudzba.storeId);
  const [date, setDate] = useState(
    new Date(narudzba.time).toISOString().slice(0, 16)
  );
  const [products, setProducts] = useState(narudzba.proizvodi || []);

  const [originalStatus] = useState(narudzba.status);

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

    const payload = {
      buyerId: buyer,
      storeId: store,
      status: status,
      time: new Date(date).toISOString(),
      total,
      orderItems: products.map((p, i) => {
        const original = originalOrderItems[i];
        return {
          id: original.id,
          productId: original.productId,
          price: Number(p.price),
          quantity: Number(p.quantity),
        };
      }),
    };

    const res = await apiUpdateOrderAsync(narudzba.id, payload);

    if (res.success) {
      // Ako je status promijenjen, pošalji posebno PUT poziv
      if (status !== originalStatus) {
        await apiUpdateOrderStatusAsync(narudzba.id, status);
      }
      setEditMode(false);
      onClose();
    } else {
      alert('Neuspješno ažuriranje narudžbe.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
      <DialogContent sx={{ position: 'relative', px: 3, pt: 3, pb: 4 }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 16, right: 16 }}
        >
          <CloseIcon />
        </IconButton>

        <Box display='flex' alignItems='center' mb={2}>
          <Typography
            variant='h5'
            fontWeight={800}
            sx={{ color: '#1f2937', mr: 1 }}
          >
            {`${buyer}'s Order`}
          </Typography>
          <IconButton
            onClick={() => setEditMode(!editMode)}
            sx={{ color: '#6b7280', p: 0.5 }}
          >
            {editMode ? <FaCheck size={14} /> : <FaPen size={14} />}
          </IconButton>
        </Box>

        {/* Products */}
        <Box
          sx={{
            maxHeight: 260,
            overflowY: 'auto',
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

        {/* Order Info */}
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
            {editMode ? (
              <TextField
                variant='standard'
                value={buyer}
                onChange={(e) => setBuyer(e.target.value)}
              />
            ) : (
              <Typography fontWeight={600}>{buyer}</Typography>
            )}
          </Box>

          <Box display='flex' justifyContent='space-between' mb={1}>
            <Typography color='text.secondary'>Store:</Typography>
            {editMode ? (
              <TextField
                variant='standard'
                value={store}
                onChange={(e) => setStore(e.target.value)}
              />
            ) : (
              <Typography fontWeight={600}>{store}</Typography>
            )}
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
                color='success'
                size='small'
                onClick={() => setEditMode(true)}
                sx={{ cursor: 'pointer' }}
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
