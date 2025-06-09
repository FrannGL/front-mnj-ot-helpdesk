import {
  Dialog,
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { inputStyles } from 'src/shared/utils/shared-styles';

interface TagFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { nombre: string; tags: string[] }) => void;
  initialValues: { nombre: string; tags: string[] };
  setFormState: React.Dispatch<React.SetStateAction<{ nombre: string; tags: string[] }>>;
}

export const TagForm = ({ open, onClose, onSubmit, initialValues, setFormState }: TagFormProps) => {
  const handleChangeNombre = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, nombre: e.target.value }));
  };

  const handleSubmit = () => {
    if (!initialValues.nombre || initialValues.nombre.trim() === '') return;
    onSubmit(initialValues);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{initialValues ? 'Editar Tag' : 'Nuevo Tag'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          margin="dense"
          label="Nombre del Tag"
          sx={inputStyles}
          value={initialValues.nombre}
          onChange={handleChangeNombre}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          {initialValues ? 'Guardar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
