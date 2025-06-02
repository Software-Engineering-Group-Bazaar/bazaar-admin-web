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
import { useTranslation } from 'react-i18next';

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  ticketTitle,
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <DeleteIcon color='error' sx={{ mr: 1, verticalAlign: 'middle' }} />
        {t('common.delete')}
      </DialogTitle>
      <DialogContent>
        <Typography>
          {t('common.confirmDelete', { item: ticketTitle })}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='outlined'>
          {t('common.cancel')}
        </Button>
        <Button onClick={onConfirm} color='error' variant='contained'>
          {t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
