import React from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const RoutesHeader = ({ onAddUser, searchTerm, setSearchTerm }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        width: "100%",
        py: 3,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Box sx={{ textAlign: "left" }}>
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          All Routes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Admin Panel &gt; Routes
        </Typography>
      </Box>
    </Box>
  );
};

export default RoutesHeader;
