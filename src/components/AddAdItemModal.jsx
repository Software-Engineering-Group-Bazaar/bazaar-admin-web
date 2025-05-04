import React, { useState } from 'react';
import {
  Modal, Box, TextField, MenuItem, Typography, Button,
} from '@mui/material';
import ImageUploader from './ImageUploader'; 
import { apiGetStoreProductsAsync } from '@api/api';
const AddAdItemModal = ({ open, onClose, onAddItem, stores}) => {
  const [formData, setFormData] = useState({
    Image: '',
    StoreLink: '',
    ProductLink: '',
    Description: '',
  });

  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStoreChange = async (e) => {
    const selectedStoreLink = e.target.value;
    setFormData((prev) => ({
      ...prev,
      StoreLink: selectedStoreLink,
    }));
    try {
      const result = await apiGetStoreProductsAsync(selectedStoreLink);
      setProducts(result.data || []);
    } catch (err) {
      console.error('Failed to fetch products for store:', err);
    }
  };

  const handleImageUpload = (files) => {
    // Store the first file (or its preview URL)
    const file = files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file); // Optional: for preview
      setFormData((prev) => ({ ...prev, Image: previewUrl }));
    }
  };

  const handleSubmit = () => {
    const err = {};
    if (!formData.Description.trim()) err.Description = 'Required';
    if (!formData.ProductLink) err.ProductLink = 'Required';
    if (!formData.StoreLink) err.StoreLink = 'Required';
    if (!formData.Image) err.Image = 'Image is required';

    setErrors(err);
    if (Object.keys(err).length > 0) return;

    onAddItem(formData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: 'background.paper',
        p: 4,
        borderRadius: 2,
        display: 'flex',
        gap: 4,
      }}>
        {/* Left: Image Uploader */}
        <Box sx={{ width: '40%' }}>
          <ImageUploader onFilesSelected={handleImageUpload} />
          {errors.Image && (
            <Typography color="error" variant="caption">{errors.Image}</Typography>
          )}
        </Box>

        {/* Right: Form Fields */}
        <Box sx={{ width: '60%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" mb={2}>Add Ad Item</Typography>

          <TextField
            name="Description"
            label="Ad Description"
            fullWidth
            value={formData.Description}
            onChange={handleChange}
            margin="dense"
            error={!!errors.Description}
            helperText={errors.Description}
          />

          <TextField
            select
            name="ProductLink"
            label="Product"
            value={formData.ProductLink}
            onChange={handleChange}
            fullWidth
            margin="dense"
            error={!!errors.ProductLink}
            helperText={errors.ProductLink}
          >
            {products.map(p => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            name="StoreLink"
            label="Store"
            value={formData.StoreLink}
            onChange={handleStoreChange}
            fullWidth
            margin="dense"
            error={!!errors.StoreLink}
            helperText={errors.StoreLink}
          >
            {stores.map(s => (
              <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
            ))}
          </TextField>

          {/* Buttons */}
          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={onClose} variant="outlined">Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">Add</Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddAdItemModal;