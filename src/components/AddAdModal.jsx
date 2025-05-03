import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import SellIcon from '@mui/icons-material/Sell';
import ImageUploader from './ImageUploader';
import {
  apiGetAllStoresAsync,
  apiFetchApprovedUsersAsync,
  apiGetStoreProductsAsync,
} from '@api/api';

const AddAdModal = ({ open, onClose, onAddAd }) => {
  const [formData, setFormData] = useState({
    sellerId: '',
    startTime: '',
    endTime: '',
    AdData: [{
      Description: '',
      Image: '',
      ProductLink: '',
      StoreLink: '',
    }],
  });

  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (open) {
      apiGetAllStoresAsync().then(setStores);
      apiFetchApprovedUsersAsync().then((users) => {
        const sellersOnly = users.filter(u => u.role.toLowerCase() === 'seller');
        setSellers(sellersOnly);
      });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['Description', 'ProductLink', 'StoreLink'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        AdData: [{
          ...prev.AdData[0],
          [name]: value,
        }],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSellerChange = async (e) => {
    const selectedSellerId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      sellerId: selectedSellerId,
    }));
    try {
      const result = await apiGetStoreProductsAsync(selectedSellerId);
      setProducts(result || []);
    } catch (err) {
      console.error('Failed to fetch products for seller:', err);
    }
  };

  const handlePhotosChange = (files) => {
    const image = files[0];
    setFormData((prev) => ({
      ...prev,
      AdData: [{
        ...prev.AdData[0],
        Image: image,
      }],
    }));
  };

  const handleSubmit = () => {
    const errors = {};

    if (!formData.sellerId) errors.sellerId = 'Seller is required';
    if (!formData.AdData[0].ProductLink) errors.ProductLink = 'Product is required';
    if (!formData.AdData[0].StoreLink) errors.StoreLink = 'Store is required';
    if (!formData.AdData[0].Description.trim()) errors.Description = 'Description is required';
  
    if (!formData.startTime) {
      errors.startTime = 'Start time is required';
    }
    if (!formData.endTime) {
      errors.endTime = 'End time is required';
    } else if (formData.startTime && formData.endTime <= formData.startTime) {
      errors.endTime = 'End time must be after start time';
    }

    setFormErrors(errors);
  
    if (Object.keys(errors).length > 0) return;
    onAddAd(formData);
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
          height: '50%',
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
          <Typography variant="h5" fontWeight={700}>
            Create Ad
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start', mb: 2 }}>
          {/* Left: Image */}
          <Box sx={{ width: '50%' }}>
            <ImageUploader onFilesSelected={handlePhotosChange} />
          </Box>

          {/* Right: Form */}
          <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
            <TextField
              select
              size="small"
              name="sellerId"
              label="Seller"
              value={formData.sellerId}
              onChange={handleSellerChange}
              error={!!formErrors.sellerId}
              helperText={formErrors.sellerId}
              sx={{ mb: 1.2 }}
              InputProps={{ sx: { borderRadius: 2, backgroundColor: '#f9f9f9' } }}
            >
              {sellers.map((seller) => (
                <MenuItem key={seller.id} value={seller.id}>
                  {seller.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              name="startTime"
              label="Start time"
              type="datetime-local"
              size="small"
              value={formData.startTime}
              onChange={handleChange}
              error={!!formErrors.startTime}
              helperText={formErrors.startTime}
              sx={{ mb: 1.2 }}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: { borderRadius: 2, backgroundColor: '#f9f9f9' } }}
            />

            <TextField
              name="endTime"
              label="End time"
              type="datetime-local"
              size="small"
              value={formData.endTime}
              onChange={handleChange}
              error={!!formErrors.endTime}
              helperText={formErrors.endTime}
              sx={{ mb: 1.2 }}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: { borderRadius: 2, backgroundColor: '#f9f9f9' } }}
            />

            <TextField
              name="Description"
              label="Description"
              fullWidth
              size="small"
              value={formData.AdData[0].Description}
              error={!!formErrors.Description}
              helperText={formErrors.Description}
              onChange={handleChange}
              sx={{ mb: 1.2 }}
              InputProps={{ sx: { backgroundColor: '#f9f9f9', borderRadius: 2 } }}
            />

            <TextField
              select
              name="ProductLink"
              label="Product link"
              size="small"
              error={!!formErrors.ProductLink}
              helperText={formErrors.ProductLink}
              value={formData.AdData[0].ProductLink}
              onChange={handleChange}
              sx={{ mb: 1.2 }}
              SelectProps={{ sx: { backgroundColor: '#f9f9f9', borderRadius: 2 } }}
            >
              {products.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              name="StoreLink"
              label="Store link"
              size="small"
              value={formData.AdData[0].StoreLink}
              onChange={handleChange}
              error={!!formErrors.StoreLink}
              helperText={formErrors.StoreLink}
              sx={{ mb: 2 }}
              SelectProps={{ sx: { backgroundColor: '#f9f9f9', borderRadius: 2 } }}
            >
              {stores.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>

            {/* Buttons */}
            <Box display="flex" gap="1.2px" justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  mr:1.2,
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
                variant="contained"
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
      </Box>
    </Modal>
  );
};

export default AddAdModal;