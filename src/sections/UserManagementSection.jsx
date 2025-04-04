import React, { useState } from "react";
import SearchBar from "../components/SearchBar.jsx";
import UserList from "../components/UserList.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { getUsers, deleteUser, searchUsers } from "../data/users.js";

export default function UserManagementSection() {
  const [users, setUsers] = useState(getUsers());
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setUsers(searchUsers(event.target.value)); 
  };

  const handleDelete = (userId) => {
    setUserToDelete(userId);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteUser(userToDelete); 
    setUsers(getUsers()); 
    setConfirmDialogOpen(false);
    setUserToDelete(null);
  };

  const cancelDelete = () => {
    setConfirmDialogOpen(false);
    setUserToDelete(null);
  };

  return (
    <div>
      <SearchBar value={searchTerm} onChange={handleSearchChange} />
      <UserList users={users} onDelete={handleDelete} />
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this user?" 
      />
    </div>
  );
}
