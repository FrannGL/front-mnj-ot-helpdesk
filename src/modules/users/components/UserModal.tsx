import { toast } from 'sonner';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import { Email, Group, Person } from '@mui/icons-material';
import {
  Grid,
  Button,
  Dialog,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  DialogTitle,
  FormControl,
  DialogActions,
  DialogContent,
  FormHelperText,
  InputAdornment,
} from '@mui/material';

import { inputStyles } from 'src/shared/utils/shared-styles';

import { useUsersMutations } from '../hooks/useUsersMutations';
import { createUserSchema, type CreateUserType } from '../schemas/user.schema';

interface Props {
  open: boolean;
  onClose: () => void;
  defaultValues?: Partial<CreateUserType>;
  type?: 'post' | 'edit';
  userId?: number;
  disabled: boolean;
}

export function UserModal({ open, onClose, defaultValues, type, userId, disabled }: Props) {
  const { updateMutation, createMutation } = useUsersMutations();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserType>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: '',
      email: '',
      groups: [],
      ...defaultValues,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: CreateUserType) => {
    try {
      if (type === 'edit' && userId) {
        await updateMutation.mutateAsync({ userId, updatedUser: data });
        toast.success('Usuario actualizado exitosamente.');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Usuario creado exitosamente.');
      }
      handleClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ocurrió un error al guardar el usuario.');
    }
  };

  useEffect(() => {
    if (open && type === 'edit') {
      reset({
        username: '',
        email: '',
        groups: [],
        ...defaultValues,
      });
    }
  }, [open, defaultValues, type, reset]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 3 }}>
        {type === 'edit' ? 'Editar Usuario' : 'Crear Nuevo Usuario'}{' '}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nombre de Usuario"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    sx={inputStyles}
                    placeholder="Ingrese el nombre de usuario"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={inputStyles}
                    placeholder="Ingrese el email"
                    type="email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="groups"
                control={control}
                disabled={disabled}
                render={({ field }) => (
                  <FormControl error={!!errors.groups} fullWidth>
                    <InputLabel>Roles</InputLabel>
                    <Select
                      {...field}
                      multiple
                      label="Roles"
                      placeholder="Seleccione roles"
                      startAdornment={
                        <InputAdornment position="start">
                          <Group />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value={1}>Administrador</MenuItem>
                      <MenuItem value={2}>Agente</MenuItem>
                      <MenuItem value={3}>Cliente</MenuItem>
                    </Select>
                    {errors.groups && <FormHelperText>{errors.groups.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            {type === 'edit' ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
