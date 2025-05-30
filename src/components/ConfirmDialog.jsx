import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
  } from "@mui/material";
  import { useTranslation } from 'react-i18next';
  
  export default function ConfirmDialog({ open, onClose, onConfirm, message }) {
    const { t } = useTranslation();
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{t('common.confirm')}</DialogTitle>
        <DialogContent>
          <Typography>{message || t('common.confirmAction')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            {t('common.cancel')}
          </Button>
          <Button onClick={onConfirm} color="error">
            {t('common.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  