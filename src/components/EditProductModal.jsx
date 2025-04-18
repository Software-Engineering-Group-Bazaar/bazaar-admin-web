import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  IconButton,
} from '@mui/material';
import { HiOutlineCube } from 'react-icons/hi';
import { apiUpdateProductAsync, apiGetProductCategoriesAsync } from '@api/api';
import ImageUploader from '@components/ImageUploader';
import DeleteIcon from '@mui/icons-material/Delete';

const weightUnits = ['kg', 'g', 'lbs'];
const volumeUnits = ['L', 'ml', 'oz'];

const EditProductModal = ({ open, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    weight: '',
    weightunit: 'kg',
    volume: '',
    volumeunit: 'L',
    productcategoryid: '',
    isActive: true,
  });

  const [productCategories, setProductCategories] = useState([]);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (open) {
      apiGetProductCategoriesAsync().then(setProductCategories);
      if (product) {
        setFormData({
          name: product.name || '',
          price: product.price || '',
          weight: product.weight || '',
          weightunit: product.weightunit || 'kg',
          volume: product.volume || '',
          volumeunit: product.volumeunit || 'L',
          productcategoryid: product.productcategoryid || '',
          isActive: product.isActive ?? true,
        });
        setPhotos(product.photos || []);
      }
    }
  }, [open, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'isActive' ? value === 'true' : value,
    }));
  };

  const handlePhotosChange = (files) => {
    setPhotos((prev) => [...prev, ...files]);
  };

  const handleDeletePhoto = (indexToRemove) => {
    setPhotos((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = async () => {
    try {
      const response = await apiUpdateProductAsync({
        ...product,
        ...formData,
        photos: photos,
      });
      if (response.status === 200) {
        onSave(response.data);
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
          width: 550,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <HiOutlineCube
          style={{
            fontSize: '48px',
            color: '#00bcd4',
            margin: '0 auto 10px auto',
            display: 'block',
          }}
        />

        <Typography variant="h5" fontWeight={700} mb={3} textAlign="center">
          Edit Product
        </Typography>

        {photos && photos.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography fontWeight={600} mb={1}>
              Current Images
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                border: '1px dashed #ccc',
                p: 1,
                borderRadius: 2,
              }}
            >
              {photos.map((file, index) => {
                const src =
                  typeof file === 'string'
                    ? file
                    : file.path || URL.createObjectURL(file);
                return (
                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid #e0e0e0',
                    }}
                  >
                    <img
                      src={src}
                      alt={`Preview ${index}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleDeletePhoto(index)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        backgroundColor: '#ffffffcc',
                        borderRadius: '50%',
                        padding: '2px',
                        zIndex: 2,
                        boxShadow: '0 0 3px rgba(0,0,0,0.3)',
                        '&:hover': { backgroundColor: '#ffebee' },
                      }}
                    >
                      <DeleteIcon fontSize="small" sx={{ color: '#b71c1c' }} />
                    </IconButton>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
        <Typography fontWeight={600} mt={2} mb={1}>
          Add More Images
        </Typography>
        <ImageUploader onFilesSelected={handlePhotosChange} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
          <TextField
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            type="number"
            fullWidth
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              type="number"
              sx={{ flex: 2 }}
            />
            <TextField
              select
              label="Unit"
              name="weightunit"
              value={formData.weightunit}
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
              label="Volume"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              type="number"
              sx={{ flex: 2 }}
            />
            <TextField
              select
              label="Unit"
              name="volumeunit"
              value={formData.volumeunit}
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
            label="Category"
            name="productcategoryid"
            value={formData.productcategoryid}
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
            label="Status"
            name="isActive"
            value={formData.isActive}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value={true}>Active</MenuItem>
            <MenuItem value={false}>Inactive</MenuItem>
          </TextField>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditProductModal;
