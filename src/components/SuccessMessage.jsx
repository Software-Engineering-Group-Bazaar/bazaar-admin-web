import React from "react";
import { Modal, Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const SuccessMessage = ({ open, onClose, isSuccess, message }) => {
  const Icon = isSuccess ? CheckCircleIcon : ErrorIcon;
  const iconColor = isSuccess ? "#4caf50" : "#f44336";
  const title = isSuccess ? "Success" : "Error";

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 320,
          bgcolor: "#fff",
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          textAlign: "center",
        }}
      >
        <Icon sx={{ fontSize: 50, color: iconColor, mb: 2 }} />
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </Box>
    </Modal>
  );
};

export default SuccessMessage;
