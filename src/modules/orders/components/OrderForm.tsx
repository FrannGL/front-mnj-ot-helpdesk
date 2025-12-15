import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { useDropzone } from 'react-dropzone';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';

import {
  Tag,
  Toc,
  Task,
  Group,
  Close,
  Category,
  CloudUpload,
  PriorityHigh,
  LocationCity,
} from '@mui/icons-material';
import {
  Box,
  Grid,
  List,
  Button,
  Dialog,
  Select,
  MenuItem,
  ListItem,
  TextField,
  InputLabel,
  Typography,
  IconButton,
  DialogTitle,
  FormControl,
  Autocomplete,
  ListItemText,
  ListItemIcon,
  DialogActions,
  DialogContent,
  FormHelperText,
  InputAdornment,
  ListItemSecondaryAction,
} from '@mui/material';

import { inputStyles } from 'src/shared/utils/shared-styles';
import { useAllTags } from 'src/modules/tags/hooks/useAllTags';
import { useAllUsers } from 'src/modules/users/hooks/useAllUsers';
import { useSectores } from 'src/modules/sectores/hooks/useSectores';
import { useAllEdificios } from 'src/modules/edificios/hooks/useAllEdificios';

import { getFileIcon } from '../utils';
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
  const { users } = useAllUsers();
  const { tags } = useAllTags();
  const { edificios } = useAllEdificios();
  const { sectores } = useSectores();

  const { createMutation, updateMutation, sendMessageMutation } = useOrders();

  const { user } = useUser();
  const activeClerkId = user?.id;

  const currentUser = users?.find((u) => u.clerk_id === activeClerkId);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateOrderType>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      cliente: currentUser?.id ?? undefined,
      titulo: '',
      estado: OrderStatusEnum.ABIERTO,
      prioridad: OrderPriorityEnum.MEDIA,
      tags: [],
      edificio: undefined,
      sector: undefined,
      ...defaultValues,
    },
  });

  const handleClose = () => {
    reset();
    setUploadedFiles([]);
    onClose();
  };

  const onSubmit = async (data: CreateOrderType) => {
    try {
      let targetOrderId = orderId;

      if (type === 'edit' && orderId) {
        await updateMutation.mutateAsync({ orderId, updatedOrder: data });
        toast.success('Orden actualizada exitosamente.');
      } else {
        const newOrder = await createMutation.mutateAsync(data);
        targetOrderId = newOrder.id;
        toast.success('Orden creada exitosamente.');
      }

      if (uploadedFiles.length > 0 && targetOrderId && currentUser?.id) {
        await sendMessageMutation.mutateAsync({
          orderId: targetOrderId,
          message: {
            usuario: currentUser.id,
            adjuntos: uploadedFiles,
          },
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ocurrió un error al guardar la orden.');
    } finally {
      handleClose();
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 10485760, // 10MB
  });

  useEffect(() => {
    if (open) {
      if (type === 'edit') {
        reset({
          ...defaultValues,
        });
      } else {
        reset({
          cliente: currentUser?.id ?? undefined,
          titulo: '',
          estado: OrderStatusEnum.ABIERTO,
          prioridad: OrderPriorityEnum.MEDIA,
          tags: [],
          edificio: undefined,
          sector: undefined,
          detalle: '',
        });
      }
    }
  }, [open, type, defaultValues, reset, currentUser]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 3 }}>
        {type === 'edit' ? `Editar Orden #OT${orderId}` : 'Crear Nueva Orden'}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            {/* Cliente */}
            <Grid item xs={12} md={4}>
              <Controller
                name="cliente"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors.cliente} fullWidth>
                    <Autocomplete
                      {...field}
                      options={users || []}
                      getOptionLabel={(option) => {
                        if (!option) return '';
                        if (typeof option === 'number') {
                          return users?.find((u) => u.id === option)?.username || '';
                        }
                        return option.username || '';
                      }}
                      value={users?.find((u) => u.id === field.value) || null}
                      onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Solicitante"
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

            {/* Prioridad */}
            <Grid item xs={12} md={4}>
              <Controller
                name="prioridad"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors.prioridad} fullWidth>
                    <InputLabel>Prioridad</InputLabel>
                    <Select
                      {...field}
                      label="Prioridad"
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

            {/* Estado */}
            <Grid item xs={12} md={4}>
              <Controller
                name="estado"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.estado}>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      {...field}
                      label="Estado"
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

            {/* Edificio */}
            <Grid item xs={12} md={4}>
              <Controller
                name="edificio"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors.edificio} fullWidth>
                    <Autocomplete
                      {...field}
                      options={edificios || []}
                      getOptionLabel={(option) => {
                        if (!option) return '';
                        if (typeof option === 'number') {
                          return edificios?.find((e) => e.id === option)?.nombre || '';
                        }
                        return option.nombre || '';
                      }}
                      value={edificios?.find((e) => e.id === field.value) || null}
                      onChange={(_, newValue) => field.onChange(newValue?.id || null)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Edificio"
                          error={!!errors.edificio}
                          helperText={errors.edificio?.message}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start">
                                  <LocationCity />
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

            {/* Piso */}
            <Grid item xs={12} md={4}>
              <Controller
                name="piso"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Piso"
                    type="number"
                    error={!!errors.piso}
                    helperText={errors.piso?.message}
                  />
                )}
              />
            </Grid>

            {/* Oficina */}
            <Grid item xs={12} md={4}>
              <Controller
                name="oficina"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Oficina"
                    error={!!errors.oficina}
                    helperText={errors.oficina?.message}
                  />
                )}
              />
            </Grid>

            {/* Sector */}
            <Grid item xs={12} md={6}>
              <Controller
                name="sector"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Sector</InputLabel>
                    <Select
                      {...field}
                      label="Sector"
                      startAdornment={
                        <InputAdornment position="start">
                          <Category />
                        </InputAdornment>
                      }
                    >
                      {sectores.map((sector) => (
                        <MenuItem key={sector.id} value={sector.id}>
                          {sector.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Tags */}
            <Grid item xs={6}>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors.tags} fullWidth>
                    <Autocomplete
                      multiple
                      disableCloseOnSelect
                      options={tags || []}
                      getOptionLabel={(option) => option?.nombre || ''}
                      value={tags?.filter((tag) => field.value?.includes(tag.id)) || []}
                      onChange={(_, newValue) => field.onChange(newValue.map((t) => t.id))}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Categorías"
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
                    />
                  </FormControl>
                )}
              />
            </Grid>

            {/* Título */}
            <Grid item xs={12}>
              <Controller
                name="titulo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Título de la orden"
                    multiline
                    error={!!errors.titulo}
                    helperText={errors.titulo?.message}
                    sx={inputStyles}
                    InputProps={{
                      startAdornment: <Toc sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                )}
              />
            </Grid>

            {/* Detalle */}
            <Grid item xs={12}>
              <Controller
                name="detalle"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Detalle"
                    multiline
                    rows={4}
                    error={!!errors.detalle}
                    helperText={errors.detalle?.message}
                    sx={inputStyles}
                    placeholder="Ingrese una descripción detallada del problema"
                    InputProps={{
                      startAdornment: <Toc sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                )}
              />
            </Grid>

            {/* Dropzone */}
            <Grid item xs={12}>
              <Box
                {...getRootProps()}
                sx={{
                  border: '2px dashed',
                  borderColor: isDragActive ? 'primary.main' : 'grey.300',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: isDragActive ? 'action.hover' : 'background.paper',
                  transition: 'all 0.2s ease',
                }}
              >
                <input {...getInputProps()} />
                <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  {isDragActive ? 'Suelta los archivos aquí' : 'Arrastra archivos o hacé clic'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  PDF, TXT, JPG, PNG, WEBP (máx. 10MB)
                </Typography>
              </Box>

              {uploadedFiles.length > 0 && (
                <List sx={{ mt: 2 }}>
                  {uploadedFiles.map((file, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        bgcolor: 'background.paper',
                        mb: 1,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <ListItemIcon>{getFileIcon(file.name)}</ListItemIcon>
                      <ListItemText
                        primary={file.name}
                        secondary={`${(file.size / 1024).toFixed(2)} KB`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => removeFile(index)} size="small">
                          <Close />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : type === 'edit' ? 'Editar' : 'Enviar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default OrderForm;
