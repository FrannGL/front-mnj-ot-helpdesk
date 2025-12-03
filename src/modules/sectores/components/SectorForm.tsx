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

import { sectorSchema } from '../schemas/sector.schema';

import type { SectorFormData } from '../schemas/sector.schema';

interface SectorFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: SectorFormData) => void;
  initialValues: SectorFormData;
}

export const SectorForm = ({ open, onClose, onSubmit, initialValues }: SectorFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SectorFormData>({
    resolver: zodResolver(sectorSchema),
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

  const onSubmitForm = (data: SectorFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogTitle>{initialValues.nombre ? 'Editar Sector' : 'Nuevo Sector'}</DialogTitle>
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
                label="Nombre del Sector"
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
