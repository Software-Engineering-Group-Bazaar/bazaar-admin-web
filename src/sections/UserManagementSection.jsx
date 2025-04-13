import React, { useState } from "react";
import { Box } from "@mui/material";
import UserList from "../components/UserList.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import UserDetailsModal from "@components/UserDetailsModal";
import { apiUpdateUserAsync, apiToggleUserAvailabilityAsync } from "@api/api";

export default function UserManagementSection({
  allUsers,
  currentPage,
  usersPerPage,
  onDelete,
  onView,
  onEdit,
  setAllUsers,
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

  const handleEdit = async (updatedUser) => {
    try {
      if (updatedUser.toggleAvailabilityOnly) {
        onEdit(updatedUser); 

        const response = await apiToggleUserAvailabilityAsync(
          updatedUser.id,
          updatedUser.isActive
        );

        if (response.statusText==="OK") {
          onEdit({ ...updatedUser, isActive: response.isActive });
        }
      } else {
        const response = await apiUpdateUserAsync(updatedUser);
        if (response.status!==400) {
          onEdit(response.data);
        }
      }
    } catch (err) {
      console.error("Error editing user:", err);
    }
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
