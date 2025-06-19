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

import { tagSchema } from '../schemas/tag.schema';

import type { TagFormData} from '../schemas/tag.schema';

interface TagFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TagFormData) => void;
  initialValues: TagFormData;
}

export const TagForm = ({ open, onClose, onSubmit, initialValues }: TagFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
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

  const onSubmitForm = (data: TagFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogTitle>{initialValues.nombre ? 'Editar Tag' : 'Nuevo Tag'}</DialogTitle>
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
                label="Nombre del Tag"
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
