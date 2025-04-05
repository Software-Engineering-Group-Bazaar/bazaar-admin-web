import React from 'react';
import { Typography } from '@mui/material';

const UserRoles = ({ roles }) => {
  return (
    <Typography variant="body1">{roles}</Typography>
  );
};

export default UserRoles;