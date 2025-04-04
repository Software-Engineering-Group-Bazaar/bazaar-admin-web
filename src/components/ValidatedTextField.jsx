import React from 'react';
import CustomTextField from './CustomTextField';

const ValidatedTextField = ({ error, helperText, sx, ...props }) => {
  return (
    <CustomTextField
      error={error}
      helperText={helperText}
      sx={sx}
      {...props}
    />
  );
};

export default ValidatedTextField;
