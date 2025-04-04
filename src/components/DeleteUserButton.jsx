import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DeleteUserButton({ onClick }) {
  return (
    <IconButton aria-label="delete" color="error" onClick={onClick}>
      <DeleteIcon />
    </IconButton>
  );
}
