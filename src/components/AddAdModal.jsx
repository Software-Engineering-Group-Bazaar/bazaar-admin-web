import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import { apiGetAllStoresAsync, apiFetchApprovedUsersAsync,apiGetStoreProductsAsync } from '@api/api';
const AddAdModal = ({ open, onClose, onAddAd }) => {
  const [formData, setFormData] = useState({
    sellerId:'',
    startTime:'',
    endTime:'',
    AdData:[{
    Description:'',
    Image:'',
    ProductLink:'', // proizvodId
    StoreLink:'', // storeId
    }]
  });

  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  useEffect(() => {
    if (open) {
        apiGetAllStoresAsync.then(setStores);
        apiFetchApprovedUsersAsync.then((users) =>{
          const rez = users.filter((u) => u.role.toLowerCase() === "seller")
          setSellers(rez)
        })
        
        apiGetStoreProductsAsync().then((geo) => {
        setPlaces(geo?.places || []);
      });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'isActive' ? value === 'true' : value,
    }));
  };

  const handlePhotosChange = (files) => {
    const image = files[0]; 
    setFormData((prev) => ({
      ...prev,
      AdData: [{
        ...prev.AdData[0],
        Image: image,
      }]
    }));
  };

  const handleSubmit = () => {
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
          width: 480,
          bgcolor: '#fff',
          borderRadius: 3,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          p: 4,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <StoreMallDirectoryIcon sx={{ fontSize: 48, color: '#fbbc05' }} />
          <Typography variant='h5' fontWeight={700} mt={1}>
            Add New Ad
          </Typography>
        </Box>

        <ImageUploader onFilesSelected={handlePhotosChange} />

        <TextField
          name='sellerId'
          label='Seller'
          fullWidth
          value={formData.sellerId}
          onChange={handleChange}
          sx={{ mb: 2 }}
          InputProps={{ sx: { borderRadius: 2, backgroundColor: '#f9f9f9' } }}
          >
          {sellers.map((seller) => (
          <MenuItem key={seller.id} value={seller.id}>
          {seller.name} 
          </MenuItem>
          ))}
        </TextField>
        
        <TextField
          name='Start time'
          label='Start time'
          type='time'
          fullWidth
          value={formData.startTime}
          onChange={handleChange}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          InputProps={{ sx: { borderRadius: 2, backgroundColor: '#f9f9f9' } }}
        />

        <TextField
          name='End time'
          label='End time'
          type='time'
          fullWidth
          value={formData.endTime}
          onChange={handleChange}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          InputProps={{ sx: { borderRadius: 2, backgroundColor: '#f9f9f9' } }}
        />

        <TextField
          select
          name='Description'
          label='Description'
          fullWidth
          value={formData.AdData[0].placeId}
          onChange={handleChange}
          sx={{ mb: 2 }}
          SelectProps={{ sx: { backgroundColor: '#f9f9f9', borderRadius: 2 } }}
        >
        </TextField>

        <TextField
          select
          name='Product link'
          label='Product link'
          fullWidth
          value={formData.AdData[0].ProductLink}
          onChange={handleChange}
          sx={{ mb: 4 }}
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
          name='Store link'
          label='Store link'
          fullWidth
          value={formData.AdData[0].StoreLink}
          onChange={handleChange}
          sx={{ mb: 4 }}
          SelectProps={{ sx: { backgroundColor: '#f9f9f9', borderRadius: 2 } }}
        >
          {stores.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
        </TextField>

        <Box display='flex' justifyContent='flex-end' gap={2}>
          <Button
            variant='outlined'
            onClick={onClose}
            sx={{
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
    </Modal>
  );
};

export default AddAdModal;