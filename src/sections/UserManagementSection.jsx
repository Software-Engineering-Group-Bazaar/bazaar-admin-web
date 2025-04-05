import React, { useState } from "react";
import { Box } from "@mui/material";
import UserList from "../components/UserList.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import UserDetailsModal from "@components/UserDetailsModal";

export default function UserManagementSection({
  allUsers,
  currentPage,
  usersPerPage,
  onDelete,
  onView, 
}) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);


  const handleDelete = (userId) => {
    setUserToDelete(userId);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    onDelete(userToDelete);
    setConfirmDialogOpen(false);
    setUserToDelete(null);
  };

  const cancelDelete = () => {
    setConfirmDialogOpen(false);
    setUserToDelete(null);
  };

  const handleEdit = (userId) => {
    console.log("Edit user:", userId);
  };

  return (
    <Box>
      <UserList
        users={allUsers}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onView={onView}
        currentPage={currentPage}
        usersPerPage={usersPerPage}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this user?"
      />
    </Box>
  );
}
