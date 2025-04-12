import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
} from "@mui/material";

const AddUserModal = ({ open, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    roles: []
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name === "roles" ? "roles" : e.target.name]:typeof value === 'string' ? value.split(',') : e.target.value,
    }));
  };

  const handleSubmit = () => {
    onCreate(formData);
    setFormData({ userName: "", email: "", password: "", roles: []});
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        

        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Username"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
        />
        { <FormControl fullWidth>
          <InputLabel>Role</InputLabel>
          <Select
            name="roles"
            value={formData.roles}
            onChange={handleChange}
            label="Role"
            multiple
          >
            <MenuItem value="Buyer">Buyer</MenuItem>
            <MenuItem value="Seller">Seller</MenuItem>
          </Select>
        </FormControl> }
      </DialogContent>
      <DialogActions sx={{ pr: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserModal;
