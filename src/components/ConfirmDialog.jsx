import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
  } from "@mui/material";
  
  export default function ConfirmDialog({ open, onClose, onConfirm, message }) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>{message || "Are you sure you want to proceed?"}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onConfirm} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  