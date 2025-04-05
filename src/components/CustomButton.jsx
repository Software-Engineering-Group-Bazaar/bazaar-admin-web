import React from 'react';
import Button from '@mui/material/Button';
import buttonStyle from './CustomButtonStyles';

const CustomButton = ({ children, ...props }) => {
  return (
    <Button sx={buttonStyle} variant="contained" {...props}>
      {children}
    </Button>
  );
};

export default CustomButton;
