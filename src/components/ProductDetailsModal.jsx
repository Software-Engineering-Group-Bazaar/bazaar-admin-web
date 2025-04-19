import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Button,
  Divider,
  Chip,
} from '@mui/material';

const ProductDetailsModal = ({ open, onClose, product }) => {
  const [activeImage, setActiveImage] = useState(product?.images?.[0]);

  if (!product) return null;

  const {
    name,
    retailPrice,
    wholesalePrice,
    wholesaleThreshold,
    weight,
    weightUnit,
    volume,
    volumeUnit,
    productCategoryId,
    storeId,
    isActive,
    images = [],
  } = product;

  return (
    <Dialog open={open} onClose={onClose} maxWidth='lg'>
      <DialogContent sx={{ display: 'flex', gap: 4, p: 4 }}>
        {/* Left - Image List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {images.map((img, idx) => (
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
                borderRadius: 1,
                border:
                  activeImage === img ? '2px solid #000' : '1px solid #ccc',
                cursor: 'pointer',
              }}
            />
          ))}
        </Box>

        {/* Center - Main Image */}
        <Box>
          <Box
            component='img'
            src={activeImage}
            alt='Main Preview'
            sx={{
              width: 320,
              height: 420,
              objectFit: 'cover',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          />
        </Box>

        {/* Right - Product Info */}
        <Box sx={{ flex: 1 }}>
          <Typography variant='h5' fontWeight={700}>
            {name}
          </Typography>

          <Typography sx={{ mt: 1 }} color='text.secondary'>
            Category ID: {productCategoryId}
          </Typography>

          <Typography sx={{ mt: 1 }} color='text.secondary'>
            Store ID: {storeId}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant='h6' fontWeight={600}>
              {retailPrice} €
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Retail Price
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant='subtitle2'>Wholesale</Typography>
            <Typography variant='body2'>
              {wholesalePrice} € (min. {wholesaleThreshold} pcs)
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant='subtitle2'>Weight:</Typography>
            <Typography variant='body2'>
              {weight} {weightUnit}
            </Typography>
          </Box>

          <Box sx={{ mt: 1 }}>
            <Typography variant='subtitle2'>Volume:</Typography>
            <Typography variant='body2'>
              {volume} {volumeUnit}
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Chip
              label={isActive ? 'Active' : 'Inactive'}
              color={isActive ? 'success' : 'error'}
              size='small'
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <Button
            variant='contained'
            sx={{ mt: 3, backgroundColor: '#222', fontWeight: 600 }}
            fullWidth
          >
            Add to Bag
          </Button>

          <Button variant='outlined' sx={{ mt: 1, fontWeight: 600 }} fullWidth>
            Save to Wishlist
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
