import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import { Lock, Email, Person } from '@mui/icons-material';
import {
  Grid,
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
  InputAdornment,
} from '@mui/material';

import { request } from 'src/services/request';
import { inputStyles } from 'src/shared/utils/shared-styles';

import { createUserInClerk, updateUserInClerk } from '../actions/clerkActions';
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
}

export function UserModal({
  open,
  onClose,
  defaultValues,
  type,
  userId,
  clerkId,
  disabled,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (type === 'edit' && userId && clerkId) {
        const clerkData = {
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
        };

        const clerkResult = await updateUserInClerk(clerkId, clerkData);

        if (!clerkResult.success) {
          toast.error(clerkResult.error || 'Error al actualizar en Clerk');
          setIsSubmitting(false);
          return;
        }

        const dataToSend = {
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          groups: data.groups,
        };

        const response = await request(`usuarios/${userId}`, 'PATCH', dataToSend);

        if (response.error) {
          toast.error(response.error);
          setIsSubmitting(false);
          return;
        }

        toast.success('Usuario actualizado exitosamente.');
        handleClose();
      } else {
        const clerkResult = await createUserInClerk({
          email: data.email,
          password: data.password,
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
        });

        if (!clerkResult.success) {
          toast.error(clerkResult.error || 'Error al crear en Clerk');
          setIsSubmitting(false);
          return;
        }

        const dataToSend = {
          clerk_id: clerkResult.user?.id,
          username: data.username,
          email: data.email,
          groups: data.groups,
          firstName: data.firstName,
          lastName: data.lastName,
        };

        const response = await request('usuarios', 'POST', dataToSend);

        if (response.error) {
          toast.error(response.error);
          setIsSubmitting(false);
          return;
        }

        toast.success('Usuario creado exitosamente.');
        handleClose();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ocurrió un error al guardar el usuario.');
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
