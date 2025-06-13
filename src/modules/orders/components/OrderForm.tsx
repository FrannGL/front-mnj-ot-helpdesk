import { toast } from 'sonner';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import { Tag, Toc, Task, Group, PriorityHigh } from '@mui/icons-material';
import {
  Chip,
  Grid,
  Button,
  Dialog,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  DialogTitle,
  FormControl,
  Autocomplete,
  DialogActions,
  DialogContent,
  useMediaQuery,
  FormHelperText,
  InputAdornment,
} from '@mui/material';

import { useTags } from 'src/modules/tags/hooks/useTags';
import { useUsers } from 'src/modules/users/hooks/useUsers';
import { inputStyles } from 'src/shared/utils/shared-styles';

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

const OrderForm = ({ open, onClose, defaultValues, type, orderId }: OrderFormProps) => {
  const { data: users } = useUsers();
  const { data: tagsData } = useTags();

  const { createMutation, updateMutation } = useOrders();

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
      titulo: '',
      estado: OrderStatusEnum.ABIERTO,
      prioridad: OrderPriorityEnum.MEDIA,
      tags: [],
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
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ocurrió un error al guardar la orden.');
    } finally {
      handleClose();
    }
  };

  useEffect(() => {
    if (open && type === 'edit') {
      reset({
        cliente: 1,
        titulo: '',
        estado: OrderStatusEnum.ABIERTO,
        prioridad: OrderPriorityEnum.MEDIA,
        ...defaultValues,
      });
    }
  }, [open, defaultValues, type, reset]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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

            <Grid item xs={isMobileScreen ? 12 : 8}>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors.tags} fullWidth>
                    <Autocomplete
                      {...field}
                      multiple
                      disableCloseOnSelect
                      options={tagsData || []}
                      getOptionLabel={(option) => option?.nombre || ''}
                      value={field.value?.map((id) => tagsData?.find((tag) => tag.id === id)) || []}
                      onChange={(_, newValue) => {
                        field.onChange(newValue.map((tag) => tag?.id));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tags"
                          error={!!errors.tags}
                          helperText={errors.tags?.message}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <Tag sx={{ mr: 1, color: 'action.active' }} />
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => (
                          <Chip
                            label={option?.nombre}
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

            <Grid item xs={isMobileScreen ? 12 : 4}>
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

            <Grid item xs={12}>
              <Controller
                name="titulo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Título de la orden"
                    error={!!errors.titulo}
                    helperText={errors.titulo?.message}
                    sx={inputStyles}
                    multiline
                    rows={2.5}
                    placeholder="Ingrese el título de la orden"
                    InputProps={{
                      startAdornment: <Toc sx={{ mr: 1, color: 'action.active' }} />,
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
            {type === 'edit' ? 'Editar' : 'Enviar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default OrderForm;
