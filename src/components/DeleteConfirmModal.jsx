// @components/DeleteConfirmModal.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  ticketTitle,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <DeleteIcon color='error' sx={{ mr: 1, verticalAlign: 'middle' }} />
        Delete Ticket
      </DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete ticket <b>{ticketTitle}</b>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='outlined'>
          Cancel
        </Button>
        <Button onClick={onConfirm} color='error' variant='contained'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
