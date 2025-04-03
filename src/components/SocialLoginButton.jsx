import React from 'react';
import Button from '@mui/material/Button';
import socialButtonStyle from './SocialLoginButtonStyles';

const SocialLoginButton = ({ icon, label, onClick }) => {
  return (
    <Button variant="outlined" startIcon={icon} sx={socialButtonStyle} onClick={onClick}>
      {label}
    </Button>
  );
};

export default SocialLoginButton;
