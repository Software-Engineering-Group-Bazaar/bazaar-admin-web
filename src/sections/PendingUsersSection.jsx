import React from 'react';
import { Typography } from '@mui/material';
import SearchBar from '@components/SearchBar';
import PendingUsersTable from '@components/PendingUsersTable';

const PendingUsersSection = ({ searchTerm, onSearch, users, onApprove, onDelete }) => {
  return (
    <>
      <Typography variant="h5" gutterBottom>Pending Users</Typography>

      <SearchBar value={searchTerm} onChange={(e) => onSearch(e.target.value)} />

      <PendingUsersTable
        users={users}
        onApprove={onApprove}
        onDelete={onDelete}
      />
    </>
  );
};

export default PendingUsersSection;
