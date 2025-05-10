import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Checkbox,
  Button,
  Stack,
  Grid,
} from '@mui/material';
import { Edit3 } from 'lucide-react';
import {
  apiFetchAllUsersAsync,
  apiGetAllStoresAsync,
  apiGetAllProductsAsync,
} from '../api/api';

const EditAdModal = ({ open, onClose, ad, onSave }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [adItem, setAdItem] = useState({
    description: '',
    storeId: '',
    productId: '',
    trigger: '',
    displayType: '',
    clickPrice: '',
    viewPrice: '',
    conversionPrice: '',
    imageFile: null,
    existingImageUrl: '',
  });

  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    const fetchMeta = async () => {
      const s = await apiGetAllStoresAsync();
      const p = await apiGetAllProductsAsync();
      const u = await apiFetchAllUsersAsync();
      setStores(s);
      setProducts(p);
      setSellers(u);
    };
    fetchMeta();
  }, []);

  useEffect(() => {
    if (ad) {
      setStartTime(ad.startTime || '');
      setEndTime(ad.endTime || '');
      setIsActive(ad.isActive || false);
      const firstItem = (ad.adData && ad.adData[0]) || {};
      setAdItem({
        ...firstItem,
        imageFile: null,
        existingImageUrl: firstItem.imageUrl || '',
      });
    }
  }, [ad]);

  const handleFieldChange = (field, value) => {
    setAdItem({ ...adItem, [field]: value });
  };

  const handleFileChange = (file) => {
    setAdItem({ ...adItem, imageFile: file });
  };

  const handleSave = () => {
    const cleanedItem = {
      storeId: Number(adItem.storeId),
      productId: Number(adItem.productId),
      description: adItem.description,
      imageFile: adItem.imageFile || null,
      trigger: adItem.trigger,
      displayType: adItem.displayType,
      clickPrice: Number(adItem.clickPrice),
      viewPrice: Number(adItem.viewPrice),
      conversionPrice: Number(adItem.conversionPrice),
    };

    onSave?.(ad.id, {
      startTime,
      endTime,
      isActive,
      newAdDataItems: [cleanedItem],
    });

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          width: '95%',
          maxWidth: 900,
          maxHeight: '90vh',
          overflowY: 'auto',
          bgcolor: '#fff',
          borderRadius: 4,
          mx: 'auto',
          my: '5%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Edit3 color='#1976d2' style={{ marginRight: 10 }} />
          <Typography variant='h5' fontWeight={700}>
            Edit Advertisement
          </Typography>
        </Box>

        {/* Time + Active */}
        <Stack spacing={3}>
          <TextField
            label='Start Time'
            type='datetime-local'
            fullWidth
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label='End Time'
            type='datetime-local'
            fullWidth
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Box>
            <Checkbox
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              sx={{ mr: 1 }}
            />
            <Typography component='span'>Is Active</Typography>
          </Box>
        </Stack>

        <Typography variant='h6' mt={4} mb={2}>
          Advertisement Item
        </Typography>

        <Stack spacing={2}>
          <TextField
            label='Description'
            fullWidth
            value={adItem.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                value={adItem.storeId}
                onChange={(e) => handleFieldChange('storeId', e.target.value)}
                SelectProps={{ native: true }}
              >
                <option value=''>Select Store</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                value={adItem.productId}
                onChange={(e) =>
                  handleFieldChange('productId', e.target.value)
                }
                SelectProps={{ native: true }}
              >
                <option value=''>Select Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label='Trigger (e.g. search, view, buy)'
                fullWidth
                value={adItem.trigger || ''}
                onChange={(e) => handleFieldChange('trigger', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                value={adItem.displayType || ''}
                onChange={(e) =>
                  handleFieldChange('displayType', e.target.value)
                }
                SelectProps={{ native: true }}
              >
                <option value=''>Select Display Type</option>
                <option value='Left'>Left</option>
                <option value='Right'>Right</option>
                <option value='Top'>Top</option>
                <option value='Bottom'>Bottom</option>
                <option value='PopUp'>PopUp</option>
                <option value='Any'>Any</option>
              </TextField>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label='Click Price'
                type='number'
                fullWidth
                value={adItem.clickPrice || ''}
                onChange={(e) =>
                  handleFieldChange('clickPrice', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label='View Price'
                type='number'
                fullWidth
                value={adItem.viewPrice || ''}
                onChange={(e) =>
                  handleFieldChange('viewPrice', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label='Conversion Price'
                type='number'
                fullWidth
                value={adItem.conversionPrice || ''}
                onChange={(e) =>
                  handleFieldChange('conversionPrice', e.target.value)
                }
              />
            </Grid>
          </Grid>

          <Box>
            <Button variant='outlined' component='label'>
              Upload Image
              <input
                hidden
                type='file'
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
            </Button>
          </Box>
        </Stack>

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant='contained'>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditAdModal;
