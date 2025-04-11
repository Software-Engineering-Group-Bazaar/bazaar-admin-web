import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import { FiTrash2 } from "react-icons/fi";

const ConfirmDeleteModal = ({ open, onClose, onConfirm, categoryName }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          bgcolor: "#fff",
          borderRadius: 3,
          p: 4,
          boxShadow: 24,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <IconButton
          disableRipple
          sx={{
            backgroundColor: "#ffeaea",
            color: "#f44336",
            mb: 2,
            "&:hover": { backgroundColor: "#ffeaea" },
            width: 64,
            height: 64,
            borderRadius: "50%",
          }}
        >
          <FiTrash2 size={28} />
        </IconButton>

        <Typography variant="h6" fontWeight={700} gutterBottom>
          Are you sure?
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          You’re about to delete the category
          <b> {categoryName}</b>. This action cannot be undone.
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onConfirm}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
            }}
          >
            Delete
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ConfirmDeleteModal;
