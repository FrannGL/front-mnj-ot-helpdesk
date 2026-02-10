import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

import { Lock, Email, Person } from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import {
  Grid,
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { inputStyles } from 'src/shared/utils/shared-styles';

import { simpleUpdateUser } from '../actions/clerkActions';
import { useUsersMutations } from '../hooks/useUsersMutations';
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserType,
  type UpdateUserType,
} from '../schemas/user.schema';

interface Props {
  open: boolean;
  onClose: () => void;
  defaultValues?: Partial<UpdateUserType>;
  type?: 'post' | 'edit';
  userId?: number;
  clerkId?: string;
  disabled: boolean;
  onUserCreated?: () => void;
}

export function UserModal({
  open,
  onClose,
  defaultValues,
  type,
  userId,
  clerkId,
  disabled,
  onUserCreated,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createMutation } = useUsersMutations();
  const queryClient = useQueryClient();

  const schema = type === 'edit' ? updateUserSchema : createUserSchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserType>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      groups: [],
      ...defaultValues,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: CreateUserType) => {
    setIsSubmitting(true);

    try {
      if (type === 'edit' && userId !== undefined && clerkId) {
        const result = await simpleUpdateUser(
          clerkId,
          data.firstName || '',
          data.lastName || '',
          data.username || ''
        );

        if (result.success) {
          queryClient.invalidateQueries({ queryKey: ['users'] });
          toast.success('Usuario actualizado exitosamente.');
          handleClose();
          onUserCreated?.();
        } else {
          toast.error(result.error || 'Error al actualizar el usuario');
        }
      } else {
        await createMutation.mutateAsync({
          email: data.email,
          password: data.password,
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          groups: data.groups,
        });

        toast.success('Usuario creado exitosamente.');
        onUserCreated?.();
        handleClose();
      }
    } catch (error: any) {
      toast.error(error.message || 'Ocurrió un error al guardar el usuario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (open && type === 'edit') {
      reset({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        groups: [],
        ...defaultValues,
      });
    }
  }, [open, defaultValues, type, reset]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 3 }}>
        {type === 'edit' ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nombre"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    sx={inputStyles}
                    placeholder="Ingrese el nombre"
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

            <Grid item xs={12} sm={6}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Apellido"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    sx={inputStyles}
                    placeholder="Ingrese el apellido"
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
                    disabled={type === 'edit'}
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

            {type === 'post' && (
              <Grid item xs={12}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Contraseña"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      sx={inputStyles}
                      placeholder="Ingrese la contraseña"
                      type="password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} variant="outlined" color="inherit" disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {type === 'edit' ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
