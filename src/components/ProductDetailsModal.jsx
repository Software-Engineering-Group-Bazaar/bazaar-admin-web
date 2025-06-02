import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Divider,
  Chip,
  useTheme,
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import CategoryIcon from '@mui/icons-material/Category';
import ScaleIcon from '@mui/icons-material/MonitorWeight';
import VolumeUpIcon from '@mui/icons-material/Opacity';
import { apiGetAllStoresAsync, apiGetProductCategoriesAsync } from '@api/api';

const ProductDetailsModal = ({ open, onClose, product }) => {
  const theme = useTheme();
  const [activeImage, setActiveImage] = useState(null);
  const [storeName, setStoreName] = useState('');
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (product?.photos?.length) {
      const first =
        typeof product.photos[0] === 'string'
          ? product.photos[0]
          : product.photos[0]?.path;
      setActiveImage(resolveImage(first));
    }
  }, [product]);

  useEffect(() => {
    if (open && product) {
      loadStoreAndCategory();
    }
  }, [open, product]);

  const loadStoreAndCategory = async () => {
    try {
      const [stores, categories] = await Promise.all([
        apiGetAllStoresAsync(),
        apiGetProductCategoriesAsync(),
      ]);

      const foundStore = stores.find((s) => s.id === product.storeId);
      const foundCategory = categories.find(
        (c) => c.id === product.productCategory?.id
      );

      setStoreName(foundStore?.name || 'Unknown Store');
      setCategoryName(foundCategory?.name || 'Unknown Category');
    } catch (err) {
      console.error('Greška prilikom učitavanja store/kategorije:', err);
    }
  };

  const resolveImage = (path) => {
    if (!path) return '';
    return path.startsWith('http')
      ? path
      : `${import.meta.env.VITE_API_BASE_URL}${path}`;
  };

  if (!product) return null;

  const {
    name,
    retailPrice,
    weight,
    weightUnit,
    volume,
    volumeUnit,
    isActive,
    photos = [],
  } = product;

  const normalizedPhotos = photos.map((p) =>
    resolveImage(typeof p === 'string' ? p : p?.path)
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      BackdropProps={{
        style: {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 0,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          minWidth: 760,
        },
      }}
    >
      <DialogContent
        sx={{
          display: 'flex',
          gap: 4,
          p: 4,
          backgroundColor: '#fff',
        }}
      >
        {/* Left - Thumbnails */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {normalizedPhotos.map((img, idx) => (
            <Box
              key={idx}
              component='img'
              src={img}
              alt={`preview-${idx}`}
              onClick={() => setActiveImage(img)}
              sx={{
                width: 60,
                height: 60,
                objectFit: 'cover',
                borderRadius: 2,
                border:
                  activeImage === img ? '2px solid #4a0404' : '1px solid #ccc',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/fallback.png';
              }}
            />
          ))}
        </Box>

        {/* Main image */}
        <Box>
          <Box
            component='img'
            src={activeImage}
            alt='Main Preview'
            sx={{
              width: 320,
              height: 420,
              objectFit: 'cover',
              borderRadius: 3,
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/fallback.png';
            }}
          />
        </Box>

        {/* Info */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant='h5'
            fontWeight={800}
            color='#4a0404'
            sx={{ mb: 1 }}
          >
            {name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <StoreIcon sx={{ fontSize: 18, color: '#607d8b' }} />
            <Typography fontSize={14} color='text.secondary'>
              {storeName}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CategoryIcon sx={{ fontSize: 18, color: '#607d8b' }} />
            <Typography fontSize={14} color='text.secondary'>
              {categoryName}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScaleIcon sx={{ fontSize: 18, color: '#4a0404' }} />
              <Typography fontSize={14} color='#4a0404' fontWeight={600}>
                Weight:
              </Typography>
              <Typography fontSize={14}>
                {weight} {weightUnit || ''}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VolumeUpIcon sx={{ fontSize: 18, color: '#4a0404' }} />
              <Typography fontSize={14} color='#4a0404' fontWeight={600}>
                Volume:
              </Typography>
              <Typography fontSize={14}>
                {volume} {volumeUnit || ''}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Chip
              label={isActive ? 'Active' : 'Inactive'}
              color={isActive ? 'success' : 'error'}
              size='small'
              sx={{
                fontWeight: 600,
                borderRadius: 1.5,
              }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant='h4'
            fontWeight={900}
            textAlign='left'
            color='#4a0404'
          >
            {retailPrice} KM
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
