import React, { useState, useEffect } from 'react';
import { InputAdornment } from '@mui/material';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import SellIcon from '@mui/icons-material/Sell';
import AddAdItemModal from './AddAdItemModal';
import {
  apiGetAllStoresAsync,
  apiFetchApprovedUsersAsync,
} from '@api/api';

const AddAdModal = ({ open, onClose, onAddAd }) => {
  const [formData, setFormData] = useState({
    sellerId: '',
    Views: 0,
    Clicks: 0,
    Conversions: 0,
    clickPrice: '',
    viewPrice: '',
    conversionPrice: '',
    startTime: '',
    endTime: '',
    isActive: true,
    AdData: [],
  });

  const [stores, setStores] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [adItemModalOpen, setAdItemModalOpen] = useState(false);
  
  useEffect(() => {
    if (open) {
      apiGetAllStoresAsync().then(setStores);
      apiFetchApprovedUsersAsync().then((users) => {
        const sellersOnly = users.filter((u) => {
          const role = (u.roles?.[0] || 'buyer').toLowerCase();
          return role === 'seller';
        });
        setSellers(sellersOnly);
      });
    }
  }, [open]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleAddAdItem = (item) => {
    setFormData((prev) => ({
      ...prev,
      AdData: [...prev.AdData, item],
    }));
  };

  const handleSubmit = () => {
    const errors = {};
    console.log(formData);
    if (!formData.sellerId) errors.sellerId = 'Seller is required';
    if (!formData.startTime) errors.startTime = 'Start time is required';
    if (!formData.endTime) {
      errors.endTime = 'End time is required';
    } else if (formData.startTime && formData.endTime <= formData.startTime) {
      errors.endTime = 'End time must be after start time';
    }

    if(!formData.clickPrice) errors.clickPrice = 'Price per click is required';
    if(!formData.viewPrice) errors.viewPrice = 'Price per view is required';
    if(!formData.conversionPrice) errors.conversionPrice = 'Price per conversion is required'; 

    if (formData.AdData.length === 0) {
      errors.AdData = 'At least one ad item is required';
    }


    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    onAddAd(formData);

    setFormData({
      sellerId: '',
      startTime: '',
      endTime: '',
      AdData: []
    });

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'auto',
          maxWidth: 1000,
          height: 'auto',
          maxHeight: '90vh',
          overflowY: 'auto',
          bgcolor: '#fff',
          borderRadius: 3,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          p: 4,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
            gap: 1,
          }}
        >
          <SellIcon sx={{ fontSize: 28, color: '#fbbc05' }} />
          <Typography variant='h5' fontWeight={700}>
            Create Ad
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start', mb: 2 }}>
          {/* Right: Form */}
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <TextField
              select
              size='small'
              name='sellerId'
              label='Seller'
              value={formData.sellerId}
              onChange={handleChange}
              error={!!formErrors.sellerId}
              helperText={formErrors.sellerId}
              sx={{ mb: 1.2 }}
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: '#f9f9f9' },
              }}
            >
              {sellers.map((seller) => (
                <MenuItem key={seller.id} value={seller.id}>
                  {seller.userName}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              name='startTime'
              label='Start time'
              type='datetime-local'
              size='small'
              value={formData.startTime}
              onChange={handleChange}
              error={!!formErrors.startTime}
              helperText={formErrors.startTime}
              sx={{ mb: 1.2 }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: '#f9f9f9' },
              }}
            />

            <TextField
              name='endTime'
              label='End time'
              type='datetime-local'
              size='small'
              value={formData.endTime}
              onChange={handleChange}
              error={!!formErrors.endTime}
              helperText={formErrors.endTime}
              sx={{ mb: 1.2 }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: '#f9f9f9' },
              }}
            />

            {/* Error message if no items */}
            {formErrors.AdData && (
              <Typography color='error' variant='body2' sx={{ mb: 1 }}>
                {formErrors.AdData}
              </Typography>
            )}

            {/* Display added ad items */}
            {formData.AdData.map((item, index) => (
              <Box
                key={index}
                sx={{ p: 1, border: '1px solid #ddd', borderRadius: 2, mb: 1 }}
              >
                <Typography variant='body2'>
                  <strong>Ad Text:</strong> {item.Description}
                </Typography>
                <Typography variant='body2'>
                  <strong>Store:</strong> {item.StoreLink}
                </Typography>
                <Typography variant='body2'>
                  <strong>Product:</strong> {item.ProductLink}
                </Typography>
              </Box>
            ))}
<TextField
  name="clickPrice"
  label="Click Price"
  type="number"
  size="small"
  value={formData.clickPrice}
  onChange={handleChange}
  error={!!formErrors.clickPrice}
  helperText={formErrors.clickPrice}
  sx={{ mb: 1.2 }}
  InputProps={{
    sx: { borderRadius: 2, backgroundColor: '#f9f9f9' },
    inputProps: { min: 0 },
    endAdornment: <InputAdornment position="end">KM</InputAdornment>,
  }}
/>

<TextField
  name="viewPrice"
  label="View Price"
  type="number"
  size="small"
  value={formData.viewPrice}
  onChange={handleChange}
  error={!!formErrors.viewPrice}
  helperText={formErrors.viewPrice}
  sx={{ mb: 1.2 }}
  InputProps={{
    sx: { borderRadius: 2, backgroundColor: '#f9f9f9' },
    inputProps: { min: 0 },
    endAdornment: <InputAdornment position="end">KM</InputAdornment>,
  }}
/>

<TextField
  name="conversionPrice"
  label="Conversion Price"
  type="number"
  size="small"
  value={formData.conversionPrice}
  onChange={handleChange}
  error={!!formErrors.conversionPrice}
  helperText={formErrors.conversionPrice}
  sx={{ mb: 1.2 }}
  InputProps={{
    sx: { borderRadius: 2, backgroundColor: '#f9f9f9' },
    inputProps: { min: 0 },
    endAdornment: <InputAdornment position="end">KM</InputAdornment>,
  }}
/>
             <Button
              variant='outlined'
              onClick={() => setAdItemModalOpen(true)}
              sx={{
                mb: 1.2,
                color: '#444',
                borderColor: '#bbb',
                textTransform: 'none',
                borderRadius: 2,
              }}
            >
              Add Item
            </Button>
            {formErrors.AdData && (
            <Typography color='error' variant='body2' sx={{ mb: 1 }}>
            {formErrors.AdData}
            </Typography>
            )}
            {/* Buttons */}
            <Box display='flex' gap='1.2px' justifyContent='flex-end' mt={2}>
              <Button
                variant='outlined'
                onClick={onClose}
                sx={{
                  mr: 1.2,
                  color: '#555',
                  borderColor: '#ccc',
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                }}
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                onClick={handleSubmit}
                sx={{
                  backgroundColor: '#4a0404',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  '&:hover': { backgroundColor: '#3a0202' },
                }}
              >
                Save Ad
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Add Ad Item Modal */}
        <AddAdItemModal
          open={adItemModalOpen}
          onClose={() => setAdItemModalOpen(false)}
          onAddItem={handleAddAdItem}
          stores={stores}
        />
      </Box>
    </Modal>
  );
};

export default AddAdModal;