import React, { useState } from 'react';
import PendingUsersSection from '@sections/PendingUsersSection';
import ConfirmDialog from '@components/ConfirmDialog';
import mockUsers from '@data/pendingUsers';

const PendingUsers = () => {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleApprove = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, status: 'Approved' } : user
      )
    );
  };

  const handleReject = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, status: 'Rejected' } : user
      )
    );
  };

  const handleDelete = (id) => {
    setUserToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    setUsers((prev) => prev.filter((user) => user.id !== userToDelete));
    setUserToDelete(null);
    setConfirmOpen(false);
  };

  const cancelDelete = () => {
    setUserToDelete(null);
    setConfirmOpen(false);
  };

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
        onReject={handleReject}
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
