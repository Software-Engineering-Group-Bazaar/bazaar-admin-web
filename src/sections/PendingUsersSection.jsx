import React from 'react';
import PendingUsersTable from '@components/PendingUsersTable';

const PendingUsersSection = ({
  users,
  onApprove,
  onDelete,
  currentPage,
  usersPerPage,
}) => {
  return (
    <>
      <PendingUsersTable
        users={users}
        onApprove={onApprove}
        onDelete={onDelete}
        currentPage={currentPage}
        usersPerPage={usersPerPage}
      />
    </>
  );
};

export default PendingUsersSection;
