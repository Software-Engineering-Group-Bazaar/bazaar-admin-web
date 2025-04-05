import React, { useState } from 'react';
import PendingUsersSection from '@sections/PendingUsersSection';
import ConfirmDialog from '@components/ConfirmDialog';
import mockUsers from '@data/pendingUsers';

const PendingUsers = () => {
  //temporary
  const [users, setUsers] = useState(mockUsers.filter(u => u.isApproved === false));
  const [search, setSearch] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  //temporary
  const handleApprove = (id) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };
  const handleDelete = (id) => {
    setUserToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    setUsers(prev => prev.filter(user => user.id !== userToDelete));
    setUserToDelete(null);
    setConfirmOpen(false);
  };

  const cancelDelete = () => {
    setUserToDelete(null);
    setConfirmOpen(false);
  };

  //temporary
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PendingUsersSection
        searchTerm={search}
        onSearch={setSearch}
        users={filtered}
        onApprove={handleApprove}
        onDelete={handleDelete}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this user?"
      />
    </>
  );
};

export default PendingUsers;
