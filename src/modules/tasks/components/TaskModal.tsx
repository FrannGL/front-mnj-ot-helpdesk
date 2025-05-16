import { toast } from 'sonner';
import { useEffect } from 'react';
import Dropzone from 'react-dropzone';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import { Task, Group, PriorityHigh } from '@mui/icons-material';
import {
  Box,
  Chip,
  Grid,
  Button,
  Dialog,
  Select,
  MenuItem,
  useTheme,
  TextField,
  InputLabel,
  DialogTitle,
  FormControl,
  DialogActions,
  DialogContent,
  OutlinedInput,
  FormHelperText,
  InputAdornment,
} from '@mui/material';

import { useTasks } from 'src/hooks/useTasks';
import { useUsers } from 'src/hooks/useUsers';

import { inputStyles } from 'src/utils/shared-styles';

import { TaskStatus, TaskPriority } from '../enums';
import { createTaskSchema, type CreateTaskType } from '../schemas/task.schema';

interface Props {
  open: boolean;
  onClose: () => void;
  defaultValues?: Partial<CreateTaskType>;
  type?: 'post' | 'edit';
  taskId: number;
}

export function TaskModal({ open, onClose, defaultValues, type, taskId }: Props) {
  const { data: users } = useUsers();
  const { createMutation, updateMutation } = useTasks();

  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTaskType>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      cliente: undefined,
      agentes: [],
      titulo: '',
      estado: TaskStatus.PENDIENTE,
      prioridad: TaskPriority.MEDIA,
      ...defaultValues,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: CreateTaskType) => {
    try {
      if (type === 'edit') {
        await updateMutation.mutateAsync({ taskId, updatedTask: data });
        toast.success('Orden actualizada exitosamente.');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Orden creada exitosamente.');
      }
      handleClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ocurrió un error al guardar la orden.');
    }
  };

  useEffect(() => {
    if (open && type === 'edit') {
      reset({
        cliente: 1,
        agentes: [],
        titulo: '',
        estado: TaskStatus.PENDIENTE,
        prioridad: TaskPriority.MEDIA,
        ...defaultValues,
      });
    }
  }, [open, defaultValues, type, reset]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 3 }}>
        {type === 'edit' ? 'Editar Orden' : 'Crear Nueva Orden'}{' '}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={6}>
              <Controller
                name="cliente"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors.cliente} fullWidth>
                    <InputLabel>Agentes</InputLabel>
                    <Select
                      {...field}
                      label="Cliente"
                      placeholder="Seleccione cliente"
                      startAdornment={
                        <InputAdornment position="start">
                          <Group />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="" disabled>
                        Seleccione cliente
                      </MenuItem>
                      {users?.results.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.username}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.cliente && <FormHelperText>{errors.cliente.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="agentes"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors.agentes} fullWidth>
                    <InputLabel id="agentes-label">Agentes</InputLabel>
                    <Select
                      {...field}
                      labelId="agentes-label"
                      multiple
                      value={field.value || []}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      input={<OutlinedInput label="Agentes" />}
                      startAdornment={
                        <InputAdornment position="start">
                          <Group />
                        </InputAdornment>
                      }
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((id) => {
                            const user = users?.results.find((u) => u.id === id);
                            return (
                              <Chip
                                key={id}
                                label={user?.username ?? id}
                                onMouseDown={(event) => event.stopPropagation()}
                                onDelete={() => field.onChange(field.value.filter((v) => v !== id))}
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      <MenuItem value="" disabled>
                        Seleccione los agentes asignados
                      </MenuItem>
                      {users?.results.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.username}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.agentes && <FormHelperText>{errors.agentes.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="estado"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors.estado} fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      {...field}
                      label="Estado"
                      placeholder="Seleccione un estado"
                      disabled
                      startAdornment={
                        <InputAdornment position="start">
                          <Task />
                        </InputAdornment>
                      }
                    >
                      {Object.entries(TaskStatus)
                        .filter(([key]) => Number.isNaN(Number(key)))
                        .map(([key, value]) => (
                          <MenuItem key={value} value={value}>
                            {key}
                          </MenuItem>
                        ))}
                    </Select>
                    {errors.estado && <FormHelperText>{errors.estado.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="prioridad"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors.prioridad} fullWidth>
                    <InputLabel>Prioridad</InputLabel>
                    <Select
                      {...field}
                      label="Prioridad"
                      placeholder="Seleccione una prioridad"
                      startAdornment={
                        <InputAdornment position="start">
                          <PriorityHigh />
                        </InputAdornment>
                      }
                    >
                      {Object.entries(TaskPriority)
                        .filter(([key]) => Number.isNaN(Number(key)))
                        .map(([key, value]) => (
                          <MenuItem key={value} value={value}>
                            {key}
                          </MenuItem>
                        ))}
                    </Select>
                    {errors.prioridad && (
                      <FormHelperText>{errors.prioridad.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="titulo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Título de la Orden"
                    error={!!errors.titulo}
                    helperText={errors.titulo?.message}
                    sx={inputStyles}
                    multiline
                    rows={4}
                    placeholder="Ingrese el título de la tarea"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="archivo"
                control={control}
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <Box
                      sx={{
                        border: `2px dashed ${theme.palette.primary.light}`,
                        padding: 3,
                        textAlign: 'center',
                        borderRadius: 2,
                        cursor: 'pointer',
                        bgcolor: theme.palette.background.paper,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      <Dropzone
                        onDrop={(acceptedFiles) => {
                          if (acceptedFiles.length > 0) {
                            onChange(acceptedFiles[0]);
                          }
                        }}
                        accept={{
                          'application/pdf': ['.pdf'],
                          'image/jpeg': ['.jpeg', '.jpg'],
                          'image/png': ['.png'],
                        }}
                        multiple={false}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            {value ? (
                              <p>{value.name}</p>
                            ) : (
                              <p>
                                Arrastre y suelte un archivo aquí o haga clic para seleccionar uno
                                (PDF, PNG, JPEG)
                              </p>
                            )}
                          </div>
                        )}
                      </Dropzone>
                      {errors.archivo && (
                        <FormHelperText error>{errors.archivo.message as string}</FormHelperText>
                      )}
                    </Box>
                  );
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            Crear
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
