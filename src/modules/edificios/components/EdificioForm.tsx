import { useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import {
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { inputStyles } from 'src/shared/utils/shared-styles';

import { edificioSchema } from '../schemas/edificio.schema';

import type { EdificioFormData } from '../schemas/edificio.schema';

interface EdificioFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: EdificioFormData) => void;
  initialValues: EdificioFormData;
}

export const EdificioForm = ({ open, onClose, onSubmit, initialValues }: EdificioFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EdificioFormData>({
    resolver: zodResolver(edificioSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (open) {
      reset(initialValues);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open, initialValues, reset]);

  const onSubmitForm = (data: EdificioFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogTitle>{initialValues.nombre ? 'Editar Edificio' : 'Nuevo Edificio'}</DialogTitle>
        <DialogContent>
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                inputRef={inputRef}
                fullWidth
                margin="dense"
                label="Nombre del Edificio"
                sx={inputStyles}
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="error">
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            {initialValues.nombre ? 'Guardar' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
