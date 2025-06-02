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
import { apiGetStoreCategoriesAsync, apiFetchGeographyAsync } from '@api/api';
import { useTranslation } from 'react-i18next';


const AddStoreModal = ({ open, onClose, onAddStore }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    categoryid: '',
    placeId: '',
    isActive: true,
  });

  const [categories, setCategories] = useState([]);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    if (open) {
      apiGetStoreCategoriesAsync().then(setCategories);
      apiFetchGeographyAsync().then((geo) => {
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

  const handleSubmit = () => {
    onAddStore(formData);
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
            {t('common.addNewStore')}
          </Typography>
        </Box>

        <TextField
          name='name'
          label={t('common.storeName')}
          fullWidth
          value={formData.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
          InputProps={{ sx: { borderRadius: 2, backgroundColor: '#f9f9f9' } }}
        />

        <TextField
          name='address'
          label={t('common.address')}
          fullWidth
          value={formData.address}
          onChange={handleChange}
          sx={{ mb: 2 }}
          InputProps={{ sx: { borderRadius: 2, backgroundColor: '#f9f9f9' } }}
        />

        <TextField
          name='description'
          label={t('common.description')}
          fullWidth
          multiline
          rows={2}
          value={formData.description}
          onChange={handleChange}
          sx={{ mb: 2 }}
          InputProps={{ sx: { borderRadius: 2, backgroundColor: '#f9f9f9' } }}
        />

        <TextField
          select
          name='placeId'
          label={t('common.place')}
          fullWidth
          value={formData.placeId}
          onChange={handleChange}
          sx={{ mb: 2 }}
          SelectProps={{ sx: { backgroundColor: '#f9f9f9', borderRadius: 2 } }}
        >
          {places.map((place) => (
            <MenuItem key={place.id} value={place.id}>
              {place.name} ({place.postalCode})
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          name='categoryid'
          label={t('common.category')}
          fullWidth
          value={formData.categoryid}
          onChange={handleChange}
          sx={{ mb: 4 }}
          SelectProps={{ sx: { backgroundColor: '#f9f9f9', borderRadius: 2 } }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
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
              {t('common.cancel')}
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
            {t('common.saveStore')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddStoreModal;
