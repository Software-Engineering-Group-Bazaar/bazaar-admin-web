import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  useTheme,
} from '@mui/material';
import ImageUploader from './ImageUploader';
import SuccessMessage from './SuccessMessage';
import { HiOutlineCube } from 'react-icons/hi';
import style from './NewProductModalStyle';
import {
  apiCreateProductAsync,
  apiGetProductCategoriesAsync,
} from '../api/api';

const weightUnits = ['kg', 'g', 'lbs'];
const volumeUnits = ['L', 'ml', 'oz'];

const AddProductModal = ({ open, onClose, storeID }) => {
  const theme = useTheme();

  const [productCategories, setProductCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    weight: '',
    weightunit: 'kg',
    volume: '',
    volumeunit: 'L',
    productcategoryname: '',
    photos: [],
  });

  const [successModal, setSuccessModal] = useState({
    open: false,
    isSuccess: true,
    message: '',
  });

  useEffect(() => {
    if (open) {
      apiGetProductCategoriesAsync().then(setProductCategories);
    }
  }, [open]);

  useEffect(() => {
    if (successModal.open) {
      const timer = setTimeout(() => {
        setSuccessModal((prev) => ({ ...prev, open: false }));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [successModal.open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'productcategoryid') {
      const selectedCategory = productCategories.find(
        (cat) => cat.name === value
      );

      setFormData((prev) => ({
        ...prev,
        productcategoryid: selectedCategory ? selectedCategory.id : 0,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotosChange = (files) => {
    setFormData((prev) => ({ ...prev, photos: files }));
  };

  const handleSubmit = async () => {
    const selectedCategory = productCategories.find(
      (cat) => cat.name === formData.productcategoryname
    );

    if (!selectedCategory) {
      alert('Please select a valid product category.');
      return;
    }

    const productData = {
      name: formData.name,
      price: formData.price,
      weight: formData.weight,
      weightunit: formData.weightunit,
      volume: formData.volume,
      volumeunit: formData.volumeunit,
      productcategoryid: selectedCategory.id,
      storeId: storeID,
      photos: formData.photos,
    };

    try {
      const response = await apiCreateProductAsync(productData);
      if (response?.success) {
        setSuccessModal({
          open: true,
          isSuccess: true,
          message: 'Product has been successfully assigned to the store.',
        });
      } else {
        throw new Error('API returned failure.');
      }
    } catch (err) {
      setSuccessModal({
        open: true,
        isSuccess: false,
        message: 'Failed to assign product to the store.',
      });
    } finally {
      onClose();
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            ...style,
            maxWidth: '600px',
            bgcolor: '#fff',
            borderRadius: '20px',
            p: 4,
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          }}
        >
          <HiOutlineCube
            style={{
              fontSize: '58px',
              color: '#00bcd4',
              margin: '0 auto 10px auto',
              display: 'block',
            }}
          />

          <Typography
            variant='h4'
            fontWeight={700}
            color='#4a0404'
            mb={3}
            textAlign='center'
          >
            Add New Product
          </Typography>

          <ImageUploader onFilesSelected={handlePhotosChange} />

          {/* Product Form */}
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label='Product Name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              fullWidth
              variant='outlined'
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: '#fafafa' },
              }}
            />

            <TextField
              label='Price'
              name='price'
              value={formData.price}
              onChange={handleChange}
              type='number'
              fullWidth
              variant='outlined'
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: '#fafafa' },
              }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 2 }}>
                <TextField
                  label='Weight'
                  name='weight'
                  value={formData.weight}
                  onChange={handleChange}
                  type='number'
                  fullWidth
                  variant='outlined'
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: '#fafafa',
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  select
                  label='Unit'
                  name='weightunit'
                  value={formData.weightunit}
                  onChange={handleChange}
                  fullWidth
                  variant='outlined'
                  sx={{ backgroundColor: '#fafafa', borderRadius: 2 }}
                >
                  {weightUnits.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 2 }}>
                <TextField
                  label='Volume'
                  name='volume'
                  value={formData.volume}
                  onChange={handleChange}
                  type='number'
                  fullWidth
                  variant='outlined'
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: '#fafafa',
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  select
                  label='Unit'
                  name='volumeunit'
                  value={formData.volumeunit}
                  onChange={handleChange}
                  fullWidth
                  variant='outlined'
                  sx={{ backgroundColor: '#fafafa', borderRadius: 2 }}
                >
                  {volumeUnits.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            <TextField
              select
              label='Category'
              name='productcategoryname'
              value={formData.productcategoryname}
              onChange={handleChange}
              required
              fullWidth
              variant='outlined'
              sx={{ backgroundColor: '#fafafa', borderRadius: 2 }}
            >
              {productCategories.map((cat) => (
                <MenuItem key={cat.id} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box
            display='flex'
            justifyContent='flex-end'
            gap={2}
            mt={4}
            sx={{ pt: 2 }}
          >
            <Button
              variant='text'
              onClick={onClose}
              sx={{ color: '#4a0404', fontWeight: 600, fontSize: '0.95rem' }}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              onClick={handleSubmit}
              sx={{
                backgroundColor: '#4a0404',
                fontWeight: 600,
                px: 4,
                borderRadius: 2,
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                '&:hover': { backgroundColor: '#3a0202' },
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      <SuccessMessage
        open={successModal.open}
        onClose={() => setSuccessModal((prev) => ({ ...prev, open: false }))}
        isSuccess={successModal.isSuccess}
        message={successModal.message}
      />
    </>
  );
};

export default AddProductModal;
