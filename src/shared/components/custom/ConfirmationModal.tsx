import {
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmationModal({ open, onClose, onConfirm }: ConfirmationModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar Eliminación</DialogTitle>
      <DialogContent>
        <DialogContentText>¿Estás seguro de que deseas eliminar este recurso?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: 'primary.light' }}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
