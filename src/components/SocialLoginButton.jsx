import React from 'react';
import Button from '@mui/material/Button';
import socialButtonStyle from './SocialLoginButtonStyles';

const SocialLoginButton = ({ icon, label }) => {
  return (
    <Button variant="outlined" startIcon={icon} sx={socialButtonStyle}>
      {label}
    </Button>
  );
};

export default SocialLoginButton;
