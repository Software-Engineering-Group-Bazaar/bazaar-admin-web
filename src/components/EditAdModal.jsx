import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Checkbox,
  Button,
  IconButton,
  Stack,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import { Edit3, Trash2 } from 'lucide-react';
import {
  apiRemoveAdItemAsync,
  apiGetStoreProductsAsync,
} from '../api/api';

const EditAdModal = ({ open, ad, stores, onClose, onSave }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [adType, setAdType] = useState('');
  const [triggers, setTriggers] = useState([]);
  const [adContentItems, setAdContentItems] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    console.log(ad);
    if (ad) {
      setStartTime(ad.startTime || '');
      setEndTime(ad.endTime || '');
      setIsActive(ad.isActive || false);
      setAdType(ad.adType || '');
      setTriggers(ad.triggers);
      setProducts([]);
      setAdContentItems(
        (ad.adData || []).map((item) => ({
          ...item,
          imageFile: null, // novo uploadovan file (ako bude)
          existingImageUrl: item.imageUrl, // postojeca slika iz GET-a
        }))
      );
    }
  }, [ad]);

  const handleFieldChange = async (index, field, value) => {
    const updatedItems = [...adContentItems];
    updatedItems[index][field] = value;
    setAdContentItems(updatedItems);

    if (field == "storeId") {
      const products = await apiGetStoreProductsAsync(value);
      setProducts(products.data);
    }
  };

  const handleFileChange = (index, file) => {
    const updatedItems = [...adContentItems];
    updatedItems[index].imageFile = file;
    setAdContentItems(updatedItems);
  };

  const handleRemoveItem = async (index) => {
    const updatedItems = [...adContentItems];
    updatedItems.splice(index, 1);

    const id = ad.adData[index].id;
    const res = await apiRemoveAdItemAsync(id);

    setAdContentItems(updatedItems);
  };

  const handleSave = () => {
    const cleanedItems = adContentItems.map((item) => ({
      storeId: Number(item.storeId),
      productId: Number(item.productId),
      description: item.description,
      imageFile: item.imageFile || null, // ako nema novog file-a, backend koristi stari
    }));

    onSave?.(ad.id, {
      startTime,
      endTime,
      isActive,
      adType,
      triggers,
      newAdDataItems: cleanedItems,
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
          <TextField
            select
            label="Ad Type"
            fullWidth
            value={adType}
            onChange={(e) => setAdType(e.target.value)}
            InputLabelProps={{ shrink: true }}
          >
            <MenuItem value="Fixed">Fixed</MenuItem>
            <MenuItem value="PopUp">PopUp</MenuItem>
          </TextField>
          <Autocomplete
            multiple
            options={['Search', 'Order', 'View']} 
            value={triggers}           
            onChange={(event, newValue) => setTriggers(newValue)}
            disableCloseOnSelect
            getOptionLabel={(option) => option}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option}
              </li>
            )}
            style={{ width: '100%', marginBottom: 16 }}
            renderInput={(params) => (
              <TextField {...params} label="Triggers" placeholder="Select triggers" />
            )}
          />
        </Stack>

        {/* Ad Items Section */}
        <Typography variant='h6' mt={4} mb={2}>
          Advertisement Items
        </Typography>

        <Box
          sx={{
            maxHeight: '30vh',
            overflowY: 'auto',
            pr: 1,
            mb: 3,
            '&::-webkit-scrollbar': {
              width: 8,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#bbb',
              borderRadius: 4,
            },
          }}
        >
          <Stack spacing={2}>
            {adContentItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: '#f9fafb',
                }}
              >
                <TextField
                  label='Description'
                  fullWidth
                  value={item.description}
                  onChange={(e) => 
                    handleFieldChange(index, 'description', e.target.value)
                  }
                  sx={{ mb: 1 }}
                />
                <TextField
                  select
                  label="Store"
                  fullWidth
                  value={item.storeId}
                  onChange={(e) => {
                    handleFieldChange(index, 'storeId', e.target.value);
                  }
                  }
                  sx={{ mb: 1 }}
                >
                  {stores.map((store) => (
                    <MenuItem key={store.id} value={store.id}>
                      {store.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Product"
                  fullWidth
                  value={item.productId || ''}
                  onChange={(e) => {
                    handleFieldChange(index, 'productId', e.target.value);
                  }
                  }
                  sx={{ mb: 1 }}
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </TextField>
                <Button variant='outlined' component='label' sx={{ mt: 1 }}>
                  Upload Image
                  <input
                    hidden
                    type='file'
                    onChange={(e) => handleFileChange(index, e.target.files[0])}
                  />
                </Button>
                <IconButton
                  onClick={() => handleRemoveItem(index)}
                  size='small'
                >
                  <Trash2 size={20} />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </Box>

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
