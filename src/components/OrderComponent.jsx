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
  MenuItem,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FaPen, FaCheck } from 'react-icons/fa';
import OrderItemCard from './OrderItemCard';

const statusOptions = [
  'Requested',
  'Confirmed',
  'Rejected',
  'Ready',
  'Sent',
  'Delivered',
  'Cancelled',
];

const OrderComponent = ({ open, onClose, narudzba }) => {
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState(narudzba.status);
  const [buyer, setBuyer] = useState(narudzba.buyerId);
  const [store, setStore] = useState(narudzba.storeId);
  const [products, setProducts] = useState(narudzba.proizvodi || []);

  const handleProductChange = (index, changes) => {
    setProducts((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...changes } : item))
    );
  };

  const total = useMemo(() => {
    return products.reduce(
      (sum, p) => sum + parseFloat(p.price) * parseInt(p.quantity),
      0
    );
  }, [products]);

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
      {/* Bubble Background */}
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
          sx={{ position: 'absolute', top: 16, right: 16 }}
        >
          <CloseIcon />
        </IconButton>

        {/* Title */}
        <Box
          display='flex'
          alignItems='center'
          mb={2}
          sx={{
            '&:hover .edit-icon': { opacity: 1, transform: 'translateX(0)' },
          }}
        >
          <Typography
            variant='h5'
            fontWeight={800}
            sx={{ color: '#1f2937', mr: 1 }}
          >
            {`${buyer}'s Order`}
          </Typography>
          <IconButton
            className='edit-icon'
            onClick={() => setEditMode(!editMode)}
            sx={{
              opacity: 0,
              transition: 'all 0.2s ease',
              transform: 'translateX(-8px)',
              color: '#6b7280',
              p: 0.5,
            }}
          >
            {editMode ? <FaCheck size={14} /> : <FaPen size={14} />}
          </IconButton>
        </Box>

        {/* Product list */}
        <Box
          sx={{
            maxHeight: 260,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            mb: 3,
            pr: 1,
            scrollbarWidth: 'thin',
            scrollbarColor: '#f6c343 transparent',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#f6c343',
              borderRadius: 8,
            },
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
                  <MenuItem key={option} value={option.toLowerCase()}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <Chip
                label={status}
                color={
                  status === 'cancelled'
                    ? 'error'
                    : status === 'active'
                      ? 'success'
                      : 'default'
                }
                size='small'
              />
            )}
          </Box>

          <Box display='flex' justifyContent='space-between' mb={1}>
            <Typography color='text.secondary'>Date:</Typography>
            <Typography fontWeight={500}>
              {new Date(narudzba.time).toLocaleString()}
            </Typography>
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
          sx={{
            mt: 4,
            py: 1.6,
            borderRadius: 99,
            fontWeight: 700,
            fontSize: '1rem',
            background: 'linear-gradient(to right, #fbbc05, #f6c343)',
            color: '#000',
            boxShadow: '0px 4px 14px rgba(251, 188, 5, 0.3)',
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(to right, #f6c343, #fbbc05)',
              boxShadow: '0px 6px 18px rgba(251, 188, 5, 0.45)',
            },
          }}
        >
          Checkout
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default OrderComponent;
