import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ placeholder = "Search", onChange, value }) => {
  return (
    <TextField
      variant="outlined"
      size="small"
      placeholder={placeholder}
      fullWidth
      value={value}
      onChange={onChange}
      sx={{
        mb: 2,
        "& .MuiOutlinedInput-root": {
          borderRadius: "32px",
          backgroundColor: "#f7f7f7",
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FiSearch size={18} />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBar;
