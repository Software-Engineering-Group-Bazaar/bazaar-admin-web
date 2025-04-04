import { Card, CardContent, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";

import UserAvatar from "../components/UserAvatar.jsx";
import UserName from "../components/UserName.jsx";
import UserEmail from "../components/UserEmail.jsx";
import UserPhone from "../components/UserPhone.jsx";
import UserRoles from "../components/UserRoles.jsx";
import UserEditForm from "../components/userEditForm.jsx";


import { Button } from "@mui/material"; // Dodaj ovaj import

import { Box } from "@mui/material";


import { getUsers, updateUser } from '../data/usersDetails.js'; // Importuj funkcije


const UserDetailsSection = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Učitaj korisnika pri učitavanju komponente
  useEffect(() => {
    const user = getUsers()[0]; // Pretpostavljamo da je samo jedan korisnik
    setSelectedUser(user);
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // Prebaci između režima prikaza i editovanja
  };

  const handleUserSave = (updatedUser) => {
    setSelectedUser(updatedUser); // Osveži podatke o korisniku nakon što je sačuvan
    setIsEditing(false); // Izađi iz režima editovanja
  };

  if (!selectedUser) {
    return <Typography>Loading user data...</Typography>;
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
      <Card sx={{ maxWidth: 400, boxShadow: 3, textAlign: "center" }}>
        <CardContent>
          {/* Prikaz korisničkih podataka */}
          <UserAvatar />
          <Typography variant="h6" sx={{ mt: 2 }}>
            <UserName userName={selectedUser.name} />
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            <UserEmail email={selectedUser.email} />
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            <UserPhone phoneNumber= {selectedUser.phoneNumber} />
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            <UserRoles roles={selectedUser.role} />
          </Typography>

          {/* Dugme za prebacivanje u režim za editovanje */}
          <Button variant="outlined" color="primary" onClick={handleEditToggle} sx={{ mt: 2 }}>
            Edit User
          </Button>

          {/* Prikaz forme za editovanje ispod podataka */}
          {isEditing && (
            <UserEditForm user={selectedUser} onSave={handleUserSave} />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDetailsSection;