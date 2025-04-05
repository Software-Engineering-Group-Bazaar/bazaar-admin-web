import { IconButton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function ApproveUserButton({ onClick }) {
  return (
    <IconButton aria-label="approve" color="success" onClick={onClick}>
      <CheckCircleIcon />
    </IconButton>
  );
}
