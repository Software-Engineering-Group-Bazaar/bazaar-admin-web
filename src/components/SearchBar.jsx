import { TextField } from "@mui/material";

export default function SearchBar({ value, onChange }) {
  return (
    <TextField
      label="Search users"
      variant="outlined"
      fullWidth
      value={value}
      onChange={onChange}
      sx={{ marginBottom: 2 }}
    />
  );
}
