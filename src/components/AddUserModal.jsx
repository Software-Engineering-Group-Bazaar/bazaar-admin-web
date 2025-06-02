import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Avatar,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const AddUserModal = ({ open, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    role: "Buyer",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        userName: "",
        email: "",
        password: "",
        role: "Buyer",
      });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      formData.userName.trim() &&
      formData.email.trim() &&
      formData.password.trim()
    ) {
      onCreate(formData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box sx={{ textAlign: "center", pt: 3 }}>
        <Avatar
          sx={{ bgcolor: "#1976d2", mx: "auto", mb: 1, width: 56, height: 56 }}
        >
          <PersonIcon fontSize="large" />
        </Avatar>
        <Typography variant="h6" fontWeight={700} mb={1}>
          Add New User
        </Typography>
      </Box>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, px: 4, pt: 1 }}
      >
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          autoComplete="off"
        />

        <TextField
          label="Username"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          fullWidth
          autoComplete="off"
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          autoComplete="new-password" // posebno za password
        />

        <RadioGroup
          row
          name="role"
          value={formData.role}
          onChange={handleChange}
          sx={{ justifyContent: "left", pt: 1 }}
        >
          <FormControlLabel value="Buyer" control={<Radio />} label="Buyer" />
          <FormControlLabel value="Seller" control={<Radio />} label="Seller" />
        </RadioGroup>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", px: 4, pb: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            color: "#d32f2f",
            borderColor: "#d32f2f",
            "&:hover": {
              backgroundColor: "#ffebee",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#155aaf",
            },
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserModal;
