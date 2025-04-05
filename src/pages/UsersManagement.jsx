import React, { useState, useEffect } from "react";
import UserManagementHeader from "@sections/UserManagementHeader";
import UserManagementPagination from "@components/UserManagementPagination";
import UserManagementSection from "@sections/UserManagementSection";
import UserDetailsModal from "@components/UserDetailsModal";
import { Box } from "@mui/material";
import { getUsers, deleteUser } from "@data/users";
import AddUserModal from "@components/AddUserModal"; 

const UsersManagements = () => {
  const usersPerPage = 8;
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);


  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Učitavanje korisnika
  const fetchUsers = () => {
    setIsLoading(true);
    const users = getUsers();
    setAllUsers(users);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  

  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / usersPerPage)
  );
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleDelete = (userId) => {
    deleteUser(userId);
    fetchUsers();

    if (currentPage > 1 && currentUsers.length === 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddUser = () => {
    setAddModalOpen(true);
  };

  const handleSaveUser = (newUser) => {
    setAllUsers((prev) => [...prev, newUser]);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleViewUser = (userId) => {
    const user = allUsers.find((u) => u.id === userId);
    console.log("Korisnik koji se šalje u modal:", user);
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
        {/* HEADER sa search inputom */}
        <UserManagementHeader
          onAddUser={handleAddUser}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* TABELA */}
        <UserManagementSection
          allUsers={currentUsers}
          currentPage={currentPage}
          usersPerPage={usersPerPage}
          onDelete={handleDelete}
          onView={handleViewUser}
        />

        {/* PAGINACIJA */}
        <UserManagementPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* MODAL */}
        <UserDetailsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          user={selectedUser}
        />

        <AddUserModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSave={handleSaveUser}
        />
      </Box>
    </Box>
  );
};

export default UsersManagements;
