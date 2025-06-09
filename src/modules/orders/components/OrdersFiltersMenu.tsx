import { useState } from 'react';
import { m } from 'framer-motion';

import {
  Person,
  SwapVert,
  PriorityHigh,
  Close as CloseIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import {
  Box,
  Chip,
  Menu,
  Grid,
  Badge,
  Stack,
  Button,
  Divider,
  Checkbox,
  FormGroup,
  IconButton,
  Typography,
  FormControlLabel,
} from '@mui/material';

import { statusColorMap } from '../utils/statusColorsMap';
import { OrderStatusEnum, OrderPriorityEnum } from '../enums';

import type { OrderFilters } from '../types';

interface OrdersFiltersMenuProps {
  filters: OrderFilters;
  onFiltersChange: (filters: OrderFilters) => void;
}

export function OrdersFiltersMenu({ filters, onFiltersChange }: OrdersFiltersMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tempFilters, setTempFilters] = useState<OrderFilters>(filters);
  const open = Boolean(anchorEl);

  // const { data: users } = useUsers();

  // const theme = useTheme();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setTempFilters(filters);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusToggle = (value: number) => {
    setTempFilters((prev) => ({
      ...prev,
      status: prev.status === value ? undefined : value,
    }));
  };

  const handlePriorityToggle = (value: number) => {
    setTempFilters((prev) => ({
      ...prev,
      priority: prev.priority === value ? undefined : value,
    }));
  };

  // const handleClienteToggle = (value: number) => {
  //   setTempFilters((prev) => ({
  //     ...prev,
  //     cliente: prev.cliente === value ? undefined : value,
  //   }));
  // };

  // const handleAssignedToToggle = (value: number) => {
  //   setTempFilters((prev) => ({
  //     ...prev,
  //     assignedTo: prev.assignedTo === value ? undefined : value,
  //   }));
  // };

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    handleClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      cliente: undefined,
      status: undefined,
      priority: undefined,
      assignedTo: undefined,
      searchTerm: undefined,
      tags: undefined,
    };
    setTempFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    handleClose();
  };

  const totalSelected = [
    tempFilters.status,
    tempFilters.priority,
    tempFilters.cliente,
    tempFilters.assignedTo,
  ].filter(Boolean).length;

  return (
    <>
      <Badge badgeContent={totalSelected} color="primary" overlap="circular">
        <IconButton
          onClick={handleOpen}
          sx={{
            backgroundColor: open ? 'action.selected' : 'transparent',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <FilterListIcon sx={{ fontSize: '30px' }} />
        </IconButton>
      </Badge>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            borderRadius: 2,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            p: 1,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="600">
              Filtros
            </Typography>
            <Stack direction="row" spacing={1}>
              {totalSelected > 0 && (
                <Button
                  size="small"
                  color="warning"
                  onClick={handleClearFilters}
                  sx={{ textTransform: 'none' }}
                >
                  Limpiar
                </Button>
              )}
              <IconButton size="small" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={5.5}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <SwapVert fontSize="small" color="action" />
                <Typography variant="subtitle1" fontWeight="500">
                  Estado
                </Typography>
                {tempFilters.status !== undefined && (
                  <Chip label={1} size="small" color="primary" sx={{ pt: 0.3 }} />
                )}
              </Stack>
              <FormGroup sx={{ gap: 1 }}>
                {Object.entries(OrderStatusEnum)
                  .filter(([k]) => Number.isNaN(Number(k)))
                  .map(([label, value]) => {
                    const color = statusColorMap[value as OrderStatusEnum];

                    return (
                      <FormControlLabel
                        key={value}
                        label={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box position="relative" width={12} height={12} flexShrink={0}>
                              <Box
                                component={m.div}
                                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0.1, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'circIn' }}
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: '50%',
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  backgroundColor: color,
                                  transform: 'translate(-50%, -50%)',
                                  filter: 'blur(4px)',
                                  zIndex: 0,
                                }}
                              />
                              <Box
                                component={m.div}
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                sx={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '100%',
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: color,
                                  transform: 'translate(-50%, -50%)',
                                  zIndex: 1,
                                }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ pl: 1.5, pt: 0.2 }}>
                              {label.replace('_', ' ')}
                            </Typography>
                          </Box>
                        }
                        control={
                          <Checkbox
                            checked={tempFilters.status === value}
                            onChange={() => handleStatusToggle(value as number)}
                            size="small"
                            color="primary"
                          />
                        }
                      />
                    );
                  })}
              </FormGroup>
            </Grid>

            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Divider orientation="vertical" flexItem sx={{ height: '100%' }} />
            </Grid>

            <Grid item xs={5.5}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <PriorityHigh fontSize="small" color="action" />
                <Typography variant="subtitle1" fontWeight="500">
                  Prioridad
                </Typography>
                {tempFilters.priority !== undefined && (
                  <Chip label={1} size="small" color="primary" sx={{ pt: 0.3 }} />
                )}
              </Stack>
              <FormGroup sx={{ gap: 1 }}>
                {Object.entries(OrderPriorityEnum)
                  .filter(([k]) => Number.isNaN(Number(k)))
                  .map(([label, value]) => (
                    <FormControlLabel
                      key={value}
                      control={
                        <Checkbox
                          checked={tempFilters.priority === value}
                          onChange={() => handlePriorityToggle(value as number)}
                          size="small"
                          color="primary"
                        />
                      }
                      label={<Typography variant="body2">{label}</Typography>}
                      sx={{
                        m: 0,
                        '&:hover': { backgroundColor: 'action.hover', borderRadius: 1 },
                      }}
                    />
                  ))}
              </FormGroup>
            </Grid>

            <Grid item xs={12} py={2}>
              <Divider />
            </Grid>

            {/* <Grid item xs={5.5}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Business fontSize="small" color="action" />
                <Typography variant="subtitle1" fontWeight="500">
                  Cliente
                </Typography>
                {tempFilters.cliente !== undefined && (
                  <Chip label={1} size="small" color="primary" sx={{ pt: 0.3 }} />
                )}
              </Stack>
              <Autocomplete
                options={users?.results || []}
                getOptionLabel={(option) => option.username}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={users?.results.find((u) => u.id === tempFilters.cliente) || null}
                onChange={(_, newValue) => {
                  if (newValue) handleClienteToggle(newValue.id);
                }}
                ListboxProps={{
                  sx: {
                    maxHeight: 200,
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '0.4em',
                    },
                    '&::-webkit-scrollbar-track': {
                      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '8px',
                    },
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    size="small"
                    placeholder="Buscar ..."
                    sx={{
                      input: { color: 'white' },
                      '& .MuiInput-underline:before': {
                        borderBottomColor: theme.palette.primary.light,
                      },
                      '& .MuiInput-underline:hover:before': {
                        borderBottomColor: theme.palette.primary.light,
                      },
                      '& .MuiInput-underline:after': {
                        borderBottomColor: theme.palette.primary.light,
                      },
                    }}
                  />
                )}
              />
            </Grid> */}

            <Grid item xs={12}>
              <Stack
                width="100%"
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                mb={2}
              >
                <Person fontSize="small" color="action" />
                <Typography variant="subtitle1" fontWeight="500">
                  Asignación
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                <FormGroup sx={{ gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={tempFilters.assignedTo === 0}
                        onChange={() => {
                          setTempFilters((prev) => ({
                            ...prev,
                            assignedTo: prev.assignedTo === 0 ? undefined : 0,
                          }));
                        }}
                        size="small"
                        color="primary"
                        sx={{ pl: 0 }}
                      />
                    }
                    label={
                      <Typography variant="body1" sx={{ pr: 1 }}>
                        Sin asignar
                      </Typography>
                    }
                    sx={{
                      m: 0,
                      '&:hover': { backgroundColor: 'action.hover', borderRadius: 1 },
                    }}
                  />
                </FormGroup>

                <Divider orientation="vertical" flexItem sx={{ mr: 1.5 }} />

                <FormGroup sx={{ gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={tempFilters.assignedTo === 1}
                        onChange={() => {
                          setTempFilters((prev) => ({
                            ...prev,
                            assignedTo: prev.assignedTo === 1 ? undefined : 1,
                          }));
                        }}
                        size="small"
                        color="primary"
                      />
                    }
                    label={<Typography variant="body1">Asignadas</Typography>}
                    sx={{
                      m: 0,
                      '&:hover': { backgroundColor: 'action.hover', borderRadius: 1 },
                    }}
                  />
                </FormGroup>
              </Stack>
            </Grid>

            {/* <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Divider orientation="vertical" flexItem sx={{ height: '100%' }} />
            </Grid> */}

            {/* <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Divider orientation="vertical" flexItem sx={{ height: '100%' }} />
            </Grid> */}

            {/* <Grid item xs={5.5}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Person fontSize="small" color="action" />
                <Typography variant="subtitle1" fontWeight="500">
                  Agentes
                </Typography>
                {tempFilters.assignedTo !== undefined && (
                  <Chip label={1} size="small" color="primary" sx={{ pt: 0.3 }} />
                )}
              </Stack>
              <Autocomplete
                options={users?.results || []}
                getOptionLabel={(option) => option.username}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={users?.results.find((u) => u.id === tempFilters.assignedTo) || null}
                onChange={(_, newValue) => {
                  if (newValue) handleAssignedToToggle(newValue.id);
                }}
                ListboxProps={{
                  sx: {
                    maxHeight: 200,
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '0.4em',
                    },
                    '&::-webkit-scrollbar-track': {
                      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '8px',
                    },
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    size="small"
                    placeholder="Buscar ..."
                    sx={{
                      input: { color: 'white' },
                      '& .MuiInput-underline:before': {
                        borderBottomColor: theme.palette.primary.light,
                      },
                      '& .MuiInput-underline:hover:before': {
                        borderBottomColor: theme.palette.primary.light,
                      },
                      '& .MuiInput-underline:after': {
                        borderBottomColor: theme.palette.primary.light,
                      },
                    }}
                  />
                )}
              />
            </Grid> */}
          </Grid>

          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleApplyFilters}
              color="primary"
              sx={{
                textTransform: 'none',
                fontWeight: '500',
                py: 1,
              }}
            >
              Aplicar filtros ({totalSelected})
            </Button>
          </Box>
        </Box>
      </Menu>
    </>
  );
}
