import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import ValidatedTextField from '../components/ValidatedTextField';
import CustomButton from '../components/CustomButton';
import { useTranslation } from 'react-i18next';

const UserCreateSection = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
  });

  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = () => {
    if (!validate()) return;

    //temporary
    console.log('User created:', formData); 
    setSnackbarOpen(true);
    setFormData({ name: '', email: '', password: '', role: 'buyer' });
  };

  return (
    <Box sx={{ maxWidth: 450, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        {t('common.createNewUser')}
      </Typography>

      <ValidatedTextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
        fullWidth
        sx={{ mb: 2 }}
      />

      <ValidatedTextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        fullWidth
        sx={{ mb: 2 }}
      />

      <ValidatedTextField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
        fullWidth
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="role-label">{t('common.role')}</InputLabel>
        <Select
          labelId="role-label"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <MenuItem value="buyer">{t('roles.buyer')}</MenuItem>
          <MenuItem value="seller">{t('roles.seller')}</MenuItem>
        </Select>
      </FormControl>

      <CustomButton onClick={handleSubmit}>{t('common.createUser')}</CustomButton>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {t('common.userCreatedSuccessfully')}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserCreateSection;
