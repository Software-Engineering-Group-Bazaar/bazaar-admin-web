import { React, useState, useEffect } from "react";
import UserManagementHeader from "@sections/UserManagementHeader";
import UserManagementPagination from "@components/UserManagementPagination";
import UserManagementSection from "@sections/UserManagementSection";
import { Box } from "@mui/material";
import { getUsers, deleteUser } from "@data/users";

const UsersManagements = () => {
  const usersPerPage = 8;
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Dohvaćanje podataka
  const fetchUsers = () => {
    setIsLoading(true);
    const users = getUsers();
    setAllUsers(users);
    setIsLoading(false);
  };

  // Inicijalno dohvaćanje i osvježavanje kada se promijeni stranica
  useEffect(() => {
    fetchUsers();
  }, []); // samo prilikom prvog rendera // Dodajemo currentPage kao dependency

  // Izračun paginacije
  const totalPages = Math.max(1, Math.ceil(allUsers.length / usersPerPage));
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = allUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleDelete = (userId) => {
    deleteUser(userId);
    fetchUsers(); // Osvježavamo podatke nakon brisanja

    // Ako smo na zadnjoj stranici i obrišemo zadnjeg korisnika
    if (currentPage > 1 && currentUsers.length === 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddUser = () => {
    console.log("Add user clicked");
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  console.log("Trenutna stranica:", currentPage);
  console.log(
    "Korisnici za prikaz:",
    currentUsers.map((u) => u.id)
  );

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
        <UserManagementHeader onAddUser={handleAddUser} />
        <UserManagementSection
          allUsers={currentUsers}
          currentPage={currentPage}
          usersPerPage={usersPerPage}
          onDelete={handleDelete}
        />
        <UserManagementPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Box>
    </Box>
  );
};

export default UsersManagements;
