import React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const StoresHeader = ({ searchTerm, setSearchTerm, onAddStore }) => {
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
          Stores
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Admin Panel &gt; Stores
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          placeholder="Search Store"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
            minWidth: { xs: "100%", sm: "240px" },
          }}
        />

        <Button
          variant="contained"
          onClick={onAddStore}
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
          Add Store
        </Button>
      </Box>
    </Box>
  );
};

export default StoresHeader;
