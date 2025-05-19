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
  Autocomplete,
  useMediaQuery,
  DialogActions,
  DialogContent,
  FormHelperText,
  InputAdornment,
} from '@mui/material';

import { inputStyles } from 'src/utils/shared-styles';

import { useUsers } from 'src/modules/users/hooks/useUsers';

import { useOrders } from '../hooks/useOrders';
import { OrderStatusEnum, OrderPriorityEnum } from '../enums';
import { createOrderSchema, type CreateOrderType } from '../schemas/order.schema';

interface OrderFormProps {
  open: boolean;
  onClose: () => void;
  defaultValues?: Partial<CreateOrderType>;
  type?: 'post' | 'edit';
  orderId?: number;
}

export function OrderForm({ open, onClose, defaultValues, type, orderId }: OrderFormProps) {
  const { data: users } = useUsers();
  const { createMutation, updateMutation } = useOrders();

  const theme = useTheme();

  const isMobileScreen = useMediaQuery('(max-width:600px)');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateOrderType>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      cliente: undefined,
      agentes: [],
      titulo: '',
      estado: OrderStatusEnum.ABIERTO,
      prioridad: OrderPriorityEnum.MEDIA,
      ...defaultValues,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: CreateOrderType) => {
    try {
      if (type === 'edit' && orderId) {
        await updateMutation.mutateAsync({ orderId, updatedOrder: data });
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
        estado: OrderStatusEnum.ABIERTO,
        prioridad: OrderPriorityEnum.MEDIA,
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
            <Grid item xs={isMobileScreen ? 12 : 6}>
              <Controller
                name="cliente"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors.cliente} fullWidth>
                    <Autocomplete
                      {...field}
                      disablePortal
                      options={users?.results || []}
                      getOptionLabel={(option) => {
                        if (!option) return '';
                        if (typeof option === 'number') {
                          return users?.results.find((u) => u.id === option)?.username || '';
                        }
                        return option.username || '';
                      }}
                      value={users?.results.find((user) => user.id === field.value) || null}
                      onChange={(_, newValue) => {
                        field.onChange(newValue?.id || '');
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Cliente"
                          error={!!errors.cliente}
                          helperText={errors.cliente?.message}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start">
                                  <Group />
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={isMobileScreen ? 12 : 6}>
              <Controller
                name="agentes"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors.agentes} fullWidth>
                    <Autocomplete
                      {...field}
                      multiple
                      disableCloseOnSelect
                      options={users?.results || []}
                      getOptionLabel={(option) => {
                        if (!option) return '';
                        if (typeof option === 'number') {
                          return users?.results.find((u) => u.id === option)?.username || '';
                        }
                        return option.username || '';
                      }}
                      value={
                        field.value?.map((id) => users?.results.find((u) => u.id === id)) || []
                      }
                      onChange={(_, newValue) => {
                        field.onChange(newValue.map((item) => item?.id));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Agentes"
                          error={!!errors.agentes}
                          helperText={errors.agentes?.message}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start">
                                  <Group />
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => (
                          <Chip
                            label={option?.username}
                            {...getTagProps({ index })}
                            onMouseDown={(event) => event.stopPropagation()}
                          />
                        ))
                      }
                    />
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={isMobileScreen ? 12 : 6}>
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
                      {Object.entries(OrderStatusEnum)
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

            <Grid item xs={isMobileScreen ? 12 : 6}>
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
                      {Object.entries(OrderPriorityEnum)
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
                        padding: isMobileScreen ? 2 : 3,
                        textAlign: 'center',
                        borderRadius: 2,
                        cursor: 'pointer',
                        bgcolor: theme.palette.background.paper,
                        color: theme.palette.text.secondary,
                        minHeight: isMobileScreen ? 'auto' : undefined,
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
                              <Button
                                variant="text"
                                color={theme.palette.mode === 'dark' ? 'inherit' : 'primary'}
                                sx={{
                                  width: isMobileScreen ? '100%' : 'auto',
                                  mb: 1,
                                }}
                              >
                                {isMobileScreen
                                  ? 'Seleccionar archivo'
                                  : 'Arrastre o seleccione un archivo'}
                              </Button>
                            )}
                            {!isMobileScreen && <p>Formatos aceptados: PDF, PNG, JPEG</p>}
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
