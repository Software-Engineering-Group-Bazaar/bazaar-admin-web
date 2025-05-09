import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
} from '@mui/material';
import { HiOutlineCube } from 'react-icons/hi';
import { apiUpdateProductAsync, apiGetProductCategoriesAsync } from '@api/api';

const weightUnits = ['kg', 'g', 'lbs'];
const volumeUnits = ['L', 'ml', 'oz'];

const EditProductModal = ({ open, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    retailPrice: '',
    weight: '',
    weightUnit: 'kg',
    volume: '',
    volumeUnit: 'L',
    productCategoryId: '',
    isActive: true,
  });

  const [productCategories, setProductCategories] = useState([]);

  useEffect(() => {
    if (open) {
      apiGetProductCategoriesAsync().then(setProductCategories);
      if (product) {
        setFormData({
          name: product.name || '',
          retailPrice: product.retailPrice || '',
          weight: product.weight || '',
          weightUnit: product.weightUnit || 'kg',
          volume: product.volume || '',
          volumeUnit: product.volumeUnit || 'L',
          productCategoryId: product.productCategoryId || '',
          isActive: product.isActive ?? true,
        });
      }
    }
  }, [open, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'isActive' ? JSON.parse(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await apiUpdateProductAsync({
        id: product.id,
        storeId: product.storeId,
        photos: product.photos,
        ...formData,
      });
      if (response.status >= 200 && response.status < 300) {
        onSave(response.data || {});
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 440,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3,
          borderRadius: 4,
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        <HiOutlineCube
          style={{
            fontSize: '44px',
            color: '#00bcd4',
            margin: '0 auto 10px auto',
            display: 'block',
          }}
        />

        <Typography variant='h6' fontWeight={700} mb={2} textAlign='center'>
          Edit Product
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label='Product Name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label='Price'
            name='retailPrice'
            value={formData.retailPrice}
            onChange={handleChange}
            type='number'
            fullWidth
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label='Weight'
              name='weight'
              value={formData.weight}
              onChange={handleChange}
              type='number'
              sx={{ flex: 2 }}
            />
            <TextField
              select
              label='Unit'
              name='weightUnit'
              value={formData.weightUnit}
              onChange={handleChange}
              sx={{ flex: 1 }}
            >
              {weightUnits.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label='Volume'
              name='volume'
              value={formData.volume}
              onChange={handleChange}
              type='number'
              sx={{ flex: 2 }}
            />
            <TextField
              select
              label='Unit'
              name='volumeUnit'
              value={formData.volumeUnit}
              onChange={handleChange}
              sx={{ flex: 1 }}
            >
              {volumeUnits.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <TextField
            select
            label='Category'
            name='productCategoryId'
            value={formData.productCategoryId}
            onChange={handleChange}
            fullWidth
          >
            {productCategories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label='Status'
            name='isActive'
            value={formData.isActive}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value={true}>Active</MenuItem>
            <MenuItem value={false}>Inactive</MenuItem>
          </TextField>
        </Box>

        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}
        >
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleSubmit}>
            Save Changes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditProductModal;
