import React, { useState } from 'react';
import {
  Modal, Box, TextField, MenuItem, Typography, Button,
} from '@mui/material';

const AddAdItemModal = ({ open, onClose, onAddItem, stores, products }) => {
  const [itemData, setItemData] = useState({
    imageUrl: '',
    storeId: '',
    productId: '',
    advertismentId: '',
    advertisment: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const err = {};
    if (!itemData.advertisment.trim()) err.advertisment = 'Required';
    if (!itemData.productId) err.productId = 'Required';
    if (!itemData.storeId) err.storeId = 'Required';

    setErrors(err);
    if (Object.keys(err).length > 0) return;

    onAddItem(itemData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 400, bgcolor: 'background.paper', p: 4, borderRadius: 2,
      }}>
        <Typography variant="h6" mb={2}>Add Ad Item</Typography>

        <TextField
          name="advertisment"
          label="Ad Text"
          fullWidth
          value={itemData.advertisment}
          onChange={handleChange}
          margin="dense"
          error={!!errors.advertisment}
          helperText={errors.advertisment}
        />

        <TextField
          select
          name="productId"
          label="Product"
          value={itemData.productId}
          onChange={handleChange}
          fullWidth
          margin="dense"
          error={!!errors.productId}
          helperText={errors.productId}
        >
          {products.map(p => (
            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          name="storeId"
          label="Store"
          value={itemData.storeId}
          onChange={handleChange}
          fullWidth
          margin="dense"
          error={!!errors.storeId}
          helperText={errors.storeId}
        >
          {stores.map(s => (
            <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
          ))}
        </TextField>

        <TextField
          name="imageUrl"
          label="Image URL"
          fullWidth
          value={itemData.imageUrl}
          onChange={handleChange}
          margin="dense"
        />

        <TextField
          name="advertismentId"
          label="Ad ID (optional)"
          fullWidth
          value={itemData.advertismentId}
          onChange={handleChange}
          margin="dense"
        />

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={onClose} variant="outlined">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Add</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddAdItemModal;