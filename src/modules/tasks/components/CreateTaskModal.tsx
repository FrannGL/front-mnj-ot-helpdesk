import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Task, Group, Message, PriorityHigh } from '@mui/icons-material';
import {
  Box,
  Grid,
  Chip,
  Dialog,
  Button,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
} from '@mui/material';

import { useUsers } from 'src/hooks/useUsers';
import { useTasks } from 'src/hooks/useTasks';

import { inputStyles } from 'src/utils/shared-styles';

import { TaskStatus, TaskPriority } from '../enums';
import { createTaskSchema, type CreateTaskType } from '../schemas/task.schema';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateTaskModal({ open, onClose }: Props) {
  const { data: users } = useUsers();
  const { createMutation } = useTasks();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTaskType>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      cliente: 1,
      agentes: [],
      titulo: '',
      estado: TaskStatus.PENDIENTE,
      prioridad: TaskPriority.MEDIA,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: CreateTaskType) => {
    try {
      await createMutation.mutateAsync(data);
      handleClose();
    } catch (error) {
      console.error('Error al crear la tarea:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>Crear Nueva Orden</DialogTitle>
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
                    label="Título"
                    error={!!errors.titulo}
                    helperText={errors.titulo?.message}
                    sx={inputStyles}
                    multiline
                    rows={4}
                    placeholder="Ingrese el título de la tarea"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Message />
                        </InputAdornment>
                      ),
                    }}
                  />
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
            Crear
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
