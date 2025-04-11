import React, { useState, useEffect } from "react";
import UserManagementHeader from "@sections/UserManagementHeader";
import UserManagementPagination from "@components/UserManagementPagination";
import UserManagementSection from "@sections/UserManagementSection";
import UserDetailsModal from "@components/UserDetailsModal";
import { Box } from "@mui/material";
import AddUserModal from "@components/AddUserModal";

import {
  apiFetchApprovedUsersAsync,
  apiDeleteUserAsync,
  apiCreateUserAsync,
} from "../api/api.js"; 

const UsersManagements = () => {
  const usersPerPage = 8;
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const users = await apiFetchApprovedUsersAsync();
        setAllUsers(users);
      } catch (err) {
        console.error("Greška pri dohvaćanju korisnika:", err);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const filteredUsers = allUsers.filter(
    (user) =>
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleDelete = async (userId) => {
    try {
      await apiDeleteUserAsync(userId);
      console.log(`User with ID ${userId} deleted successfully.`);
      setAllUsers(allUsers.filter((u) => u.id !== userId));
      if (currentPage > 1 && currentUsers.length === 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error(`Failed to delete user ${userId}:`, error);
    }
  };

  const handleAddUser = () => setAddModalOpen(true);

  const handleSaveUser = async (newUser) => {
    try {
      const createdUser = await apiCreateUserAsync({
        email: newUser.email,
        password: newUser.password,
        userName: newUser.userName,
      });
      setAllUsers((prev) => [...prev, createdUser]);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleViewUser = (userId) => {
    const user = allUsers.find((u) => u.id === userId);
    setSelectedUser(user);
    setModalOpen(true);
  };

  if (isLoading) return <Box>Loading...</Box>;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        backgroundColor: "#fefefe",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          width: "calc(100%)",
          maxWidth: "1600px",
          marginLeft: "260px",
          pt: 2,
          px: 2,
        }}
      >
        <UserManagementHeader
          onAddUser={handleAddUser}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <UserManagementSection
          allUsers={currentUsers}
          currentPage={currentPage}
          usersPerPage={usersPerPage}
          onDelete={handleDelete}
          onView={handleViewUser}
        />

        <UserManagementPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        <UserDetailsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          user={selectedUser}
        />

        <AddUserModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onCreate={handleSaveUser}
        />
      </Box>
    </Box>
  );
};

export default UsersManagements;
