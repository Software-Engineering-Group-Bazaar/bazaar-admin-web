import React, { useState, useEffect } from 'react';
import { Select, Checkbox, ListItemText } from '@mui/material';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import SellIcon from '@mui/icons-material/Sell';
import AddAdItemModal from './AddAdItemModal';
import {
  apiGetAllStoresAsync,
  apiFetchApprovedUsersAsync,
  apiCreateAdAsync,
} from '@api/api';
import { useTranslation } from 'react-i18next';

const triggerArrayToBitmask = (arr) => {
  const triggerMap = {
    View: 1,
    Search: 2,
    Order: 4,
  };
  return arr.reduce((sum, val) => sum | (triggerMap[val] || 0), 0);
};

const AddAdModal = ({ open, onClose, onAddAd }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    sellerId: '',
    Views: 0,
    Clicks: 0,
    Conversions: 0,
    clickPrice: '',
    viewPrice: '',
    conversionPrice: '',
    startTime: '',
    endTime: '',
    isActive: true,
    AdData: [],
    AdType: '',
    Triggers: [],
  });

  const [stores, setStores] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [adItemModalOpen, setAdItemModalOpen] = useState(false);

  useEffect(() => {
    if (open) {
      apiGetAllStoresAsync().then(setStores);
      apiFetchApprovedUsersAsync().then((users) => {
        const sellersOnly = users.filter((u) => {
          const role = (u.roles?.[0] || 'buyer').toLowerCase();
          return role === 'seller';
        });
        setSellers(sellersOnly);
      });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.toString(),
    }));
  };

  const handleAddAdItem = (item) => {
    setFormData((prev) => ({
      ...prev,
      AdData: [...prev.AdData, item],
    }));
  };
  const handleAdType = (e) => {
    const value = e.target.value.toString();
    setFormData((prev) => ({
      ...prev,
      AdType: value,
    }));
  };

  const handleTriggers = (e) => {
    const value = e.target.value.toString();
    if (!formData.Triggers.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        Triggers: [...prev.Triggers, value],
      }));
    }
  };
  const handleSubmit = async () => {
    const errors = {};
    console.log('[DEBUG] Raw form data before validation:', formData);
    if (!formData.sellerId) errors.sellerId = 'Seller is required';
    if (!formData.startTime) errors.startTime = 'Start time is required';
    if (!formData.endTime) {
      errors.endTime = 'End time is required';
    } else if (formData.startTime && formData.endTime <= formData.startTime) {
      errors.endTime = 'End time must be after start time';
    }

    if (!formData.clickPrice) errors.clickPrice = 'Click price required';
    if (!formData.viewPrice) errors.viewPrice = 'View price required';
    if (!formData.conversionPrice) errors.conversionPrice = 'Conversion price required';
    if (!formData.AdType) errors.AdType = 'Ad Type is required';
    if (formData.Triggers.length === 0) errors.Triggers = 'At least one trigger required';
    if (formData.AdData.length === 0) errors.AdData = 'At least one ad item required';

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (Object.keys(errors).length > 0) {
  console.warn('[DEBUG] Validation errors:', errors);
  return;

  console.log('AdType being sent:', formData.AdType);
}

      const result = {
        sellerId: formData.sellerId,
        startTime: formData.startTime,
        endTime: formData.endTime,
        clickPrice: parseFloat(formData.clickPrice),
        viewPrice: parseFloat(formData.viewPrice),
        conversionPrice: parseFloat(formData.conversionPrice),
        AdType: formData.AdType,
        Triggers: formData.Triggers,
        AdData: formData.AdData,
        isActive: formData.isActive,
      };
        setFormData({
          sellerId: '',
          startTime: '',
          endTime: '',
          clickPrice: '',
          viewPrice: '',
          conversionPrice: '',
          AdData: [],
          AdType: '',
          Triggers: [],
          isActive: true,
        });
      onAddAd(result)
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
          width: 'auto',
          maxWidth: 1000,
          maxHeight: '90vh',
          overflowY: 'auto',
          bgcolor: '#fff',
          borderRadius: 3,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          p: 4,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" mb={4} gap={1}>
          <SellIcon sx={{ fontSize: 28, color: '#fbbc05' }} />
          <Typography variant="h5" fontWeight={700}>
            {t('common.createAd')}
          </Typography>
        </Box>

        <Box display="flex" gap={4} alignItems="flex-start" mb={2}>
          <Box width="100%" display="flex" flexDirection="column">
            <TextField
              select
              size="small"
              name="sellerId"
              label={t('common.seller')}
              value={formData.sellerId}
              onChange={handleChange}
              error={!!formErrors.sellerId}
              helperText={formErrors.sellerId}
              sx={{ mb: 1.2 }}
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: '#f9f9f9' },
              }}
            >
              {sellers.map((seller) => (
                <MenuItem key={seller.id} value={seller.id}>
                  {seller.userName}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              name="startTime"
              label="Start time"
              type="datetime-local"
              size="small"
              value={formData.startTime}
              onChange={handleChange}
              error={!!formErrors.startTime}
              helperText={formErrors.startTime}
              sx={{ mb: 1.2 }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: '#f9f9f9' },
              }}
            />

            <TextField
              name="endTime"
              label={t('common.endTime')}
              type="datetime-local"
              size="small"
              value={formData.endTime}
              onChange={handleChange}
              error={!!formErrors.endTime}
              helperText={formErrors.endTime}
              sx={{ mb: 1.2 }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: '#f9f9f9' },
              }}
            />

            {formErrors.AdData && (
              <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                {formErrors.AdData}
              </Typography>
            )}



            <TextField
              name="clickPrice"
              label={t('common.clickPrice')}
              type="number"
              size="small"
              value={formData.clickPrice}
              onChange={handleChange}
              error={!!formErrors.clickPrice}
              helperText={formErrors.clickPrice}
              sx={{ mb: 1.2 }}
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: '#f9f9f9' },
                inputProps: { min: 0 },
                endAdornment: <InputAdornment position="end">KM</InputAdornment>,
              }}
            />

            <TextField
              name="viewPrice"
              label={t('common.viewPrice')}
              type="number"
              size="small"
              value={formData.viewPrice}
              onChange={handleChange}
              error={!!formErrors.viewPrice}
              helperText={formErrors.viewPrice}
              sx={{ mb: 1.2 }}
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: '#f9f9f9' },
                inputProps: { min: 0 },
                endAdornment: <InputAdornment position="end">KM</InputAdornment>,
              }}
            />

            <TextField
              name="conversionPrice"
              label={t('common.conversionPrice')}
              type="number"
              size="small"
              value={formData.conversionPrice}
              onChange={handleChange}
              error={!!formErrors.conversionPrice}
              helperText={formErrors.conversionPrice}
              sx={{ mb: 1.2 }}
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: '#f9f9f9' },
                inputProps: { min: 0 },
                endAdornment: <InputAdornment position="end">KM</InputAdornment>,
              }}
            />

          <TextField
  select
  name='AdType'
  label={t('common.adType')}
  value={formData.AdType}
  onChange={handleChange}
  fullWidth
  margin='dense'
  error={!!formErrors.AdType}
  helperText={formErrors.AdType}
>
  <MenuItem value='PopUp'>PopUp</MenuItem>
  <MenuItem value='Fixed'>Fixed</MenuItem>
</TextField>

<TextField
  select
  SelectProps={{
    multiple: true,
    renderValue: (selected) => selected.join(', '),
  }}
  name="Triggers"
  label={t('common.triggers')}
  value={Array.isArray(formData.Triggers) ? formData.Triggers : []}
  onChange={(e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      Triggers: typeof value === 'string' ? value.split(',') : value,
    }));
  }}
  fullWidth
  margin="dense"
  error={!!formErrors.Triggers}
  helperText={formErrors.Triggers}
>
  {['Search', 'Order', 'View'].map((trigger) => (
    <MenuItem key={trigger} value={trigger}>
      <Checkbox
        checked={(Array.isArray(formData.Triggers) ? formData.Triggers : []).includes(trigger)}
      />
      <ListItemText primary={trigger} />
    </MenuItem>
  ))}
</TextField>
            <Button
              variant="outlined"
              onClick={() => setAdItemModalOpen(true)}
              sx={{
                mb: 1.2,
                color: '#444',
                borderColor: '#bbb',
                textTransform: 'none',
                borderRadius: 2,
              }}
            >
              {t('common.addItem')}
            </Button>
            {formData.AdData.map((item, index) => (
              <Box
                key={index}
                sx={{ p: 1, border: '1px solid #ddd', borderRadius: 2, mb: 1 }}
              >
                <Typography variant="body2">
                  <strong>{t('common.adText')}:</strong> {item.Description}
                </Typography>
                <Typography variant="body2">
                  <strong>{t('common.store')}:</strong> {item.StoreLink}
                </Typography>
                <Typography variant="body2">
                  <strong>{t('common.product')}:</strong> {item.ProductLink}
                </Typography>
              </Box>
            ))}
            <Box display="flex" gap="1.2px" justifyContent="flex-end" mt={2}>
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  mr: 1.2,
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
                variant="contained"
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
                {t('common.saveAd')}
              </Button>
            </Box>
          </Box>
        </Box>

        <AddAdItemModal
          open={adItemModalOpen}
          onClose={() => setAdItemModalOpen(false)}
          onAddItem={handleAddAdItem}
          stores={stores}
        />
      </Box>
    </Modal>
  );
};

export default AddAdModal;
