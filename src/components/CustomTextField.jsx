import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';


const CustomTextField = ({ label, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <TextField
      variant="outlined"
      fullWidth
      label={label}
      type={isPassword && !showPassword ? 'password' : 'text'}
      {...props}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              {label.toLowerCase().includes('email') ? (
                <HiOutlineMail size={20} />
              ) : isPassword ? (
                <HiOutlineLockClosed size={20} />
              ) : null}
            </InputAdornment>
          ),
          endAdornment: isPassword && (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default CustomTextField;
