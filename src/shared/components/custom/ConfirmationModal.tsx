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
  title: string;
  content: string;
  confirmText: string;
  cancelText: string;
}

const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  cancelText,
  confirmText,
  content,
  title,
}: ConfirmationModalProps) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs">
    <DialogTitle> {title} </DialogTitle>
    <DialogContent>
      <DialogContentText> {content} </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="error">
        {cancelText}
      </Button>
      <Button onClick={onConfirm} sx={{ color: 'primary.light' }} autoFocus>
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmationModal;
