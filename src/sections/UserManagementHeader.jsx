import React from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const UserManagementHeader = ({ onAddUser }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        width: "100%", 
        px: 4, 
        py: 3, 
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Box sx={{ textAlign: "left", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          User Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Admin Panel &gt; User Management
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          placeholder="Search User"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ borderRadius: 2, backgroundColor: "#f9f9f9" }}
        />
        <Button
          variant="contained"
          onClick={onAddUser}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            backgroundColor: "#fbbc05",
            color: "#000",
            "&:hover": {
              backgroundColor: "#e6a800",
            },
          }}
        >
          Add User
        </Button>
      </Box>
    </Box>
  );
};

export default UserManagementHeader;
