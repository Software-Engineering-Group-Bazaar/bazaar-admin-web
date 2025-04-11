import React, { useContext, useState } from "react";
import PendingUsersHeader from "@sections/PendingUsersHeader";
import PendingUsersTable from "@components/PendingUsersTable";
import UserManagementPagination from "@components/UserManagementPagination";
import ConfirmDialog from "@components/ConfirmDialog";
import UserDetailsModal from "@components/UserDetailsModal";
import { Box } from "@mui/material";
import { PendingUsersContext } from "@context/PendingUsersContext";
import axios from 'axios';
import { apiApproveUserAsync } from "@api/api";
import { apiDeleteUserAsync } from "@api/api";


var baseURL = import.meta.env.VITE_API_BASE_URL

const PendingUsers = () => {
  const usersPerPage = 8;

  const { pendingUsers, setPendingUsers ,deleteUser} = useContext(PendingUsersContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredUsers = pendingUsers.filter(
    (u) =>
      u.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / usersPerPage)
  );
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleApprove = async (id) => {
    try {
      await apiApproveUserAsync(id);
      deleteUser(id); 
      console.log(`User with ID ${id} approved successfully.`);
    } catch (error) {
      console.error("Greška pri odobravanju korisnika:", error);
    }
  };

  const handleDelete = (id) => {
    setUserToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setConfirmOpen(false);
    setUserToDelete(null);
    try {
      await apiDeleteUserAsync(userToDelete);
      deleteUser(userToDelete);
      console.log(`User with ID ${userToDelete} deleted successfully.`);
    } catch (error) {
      console.error("Greška pri brisanju korisnika:", error);
    }
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setUserToDelete(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleViewUser = (userId) => {
    const user = pendingUsers.find((u) => u.id === userId);
    setSelectedUser(user);
    setModalOpen(true);
  };

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
        <PendingUsersHeader
          onAddUser={() => {}}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <PendingUsersTable
          users={currentUsers}
          onApprove={handleApprove}
          onDelete={handleDelete}
          onView={handleViewUser}
          currentPage={currentPage}
          usersPerPage={usersPerPage}
        />
        <Box sx={{ mt: 3 }}>
          <UserManagementPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Box>

        <ConfirmDialog
          open={confirmOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this user?"
        />

        <UserDetailsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          user={selectedUser}
          readOnly 
        />
      </Box>
    </Box>
  );
};

export default PendingUsers;
