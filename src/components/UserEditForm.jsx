import React, { useState } from "react";
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { updateUser } from '../data/usersDetails.js'; // Importuj funkciju za ažuriranje korisnika

const UserEditForm = ({ user, onSave }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');  // Dodano polje za broj telefona

  // Funkcija za obradu promene u imenu
  const handleNameChange = (e) => setName(e.target.value);

  // Funkcija za obradu promene u emailu
  const handleEmailChange = (e) => setEmail(e.target.value);

  // Funkcija za obradu promene u roli
  const handleRoleChange = (e) => setRole(e.target.value);

  // Funkcija za obradu promene u broju telefona
  const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);

  // Funkcija za sačuvanje promena
  const handleSave = () => {
    const updatedUser = { name, email, role, phoneNumber };
    updateUser(user.id, updatedUser);  // Ažuriraj korisnika u bazi podataka
    onSave(updatedUser);  // Osvježi roditeljsku komponentu
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 3 }}>
      <Typography variant="h6">Edit User Details</Typography>

      <TextField
        label="Name"
        variant="outlined"
        value={name}
        onChange={handleNameChange}
        sx={{ mb: 2, width: "300px" }}
      />

      <TextField
        label="Email"
        variant="outlined"
        value={email}
        onChange={handleEmailChange}
        sx={{ mb: 2, width: "300px" }}
      />

      <TextField
        label="Phone Number"
        variant="outlined"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        type="tel"
        sx={{ mb: 2, width: "300px" }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Role</InputLabel>
        <Select
          value={role}
          onChange={handleRoleChange}
          label="Role"
        >
          <MenuItem value="buyer">Buyer</MenuItem>
          <MenuItem value="seller">Seller</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ width: "300px" }}
      >
        Save Changes
      </Button>
    </Box>
  );
};

export default UserEditForm;