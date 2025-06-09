'use client';

import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { Fira_Sans } from 'next/font/google';

import {
  Chat,
  Edit,
  Sync,
  Delete,
  Cancel,
  Warning,
  MoreVert,
  CheckCircle,
  SupportAgent,
} from '@mui/icons-material';
import {
  Box,
  Chip,
  Menu,
  Paper,
  Stack,
  Table,
  Tooltip,
  Divider,
  MenuItem,
  TableRow,
  useTheme,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Pagination,
  Typography,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import { fDate } from 'src/shared/utils/format-time';
import { CreateButton } from 'src/shared/components/custom/CreateButton';
import { ConfirmationModal } from 'src/shared/components/custom/ConfirmationModal';

import { OrderChat } from '../orders/components';
import { useDebouncedValue } from '../orders/hooks';
import { useOrders } from '../orders/hooks/useOrders';
import { SortableTableCell } from './SortedTableCell';
import { OrderForm } from '../orders/components/OrderForm';
import { OrdersFilter } from '../orders/components/OrdersFilter';
import {
  getStatusIcon,
  getPriorityIcon,
  statusChipColorMap,
  priorityChipColorMap,
} from '../orders/utils';

import type { Order } from '../orders/interfaces';
import type { OrderFilters } from '../orders/types';
import type { OrderStatusEnum } from '../orders/enums';

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
});

export function AdminOrders() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [orderBy, setOrderBy] = useState<keyof Order | ''>('');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openChat, setOpenChat] = useState(false);
  const [pendingStatusId, setPendingStatusId] = useState<number | null>(null);
  const [isStatusChangeConfirmOpen, setIsStatusChangeConfirmOpen] = useState(false);
  const [filters, setFilters] = useState<OrderFilters>({
    cliente: undefined,
    status: undefined,
    priority: undefined,
    assignedTo: undefined,
    searchTerm: undefined,
    tags: undefined,
  });

  const open = Boolean(anchorEl);

  const debouncedSearchTerm = useDebouncedValue(filters.searchTerm, 1000);

  const debouncedFilters = useMemo(
    () => ({ ...filters, searchTerm: debouncedSearchTerm }),
    [filters, debouncedSearchTerm]
  );

  const { data, isLoading, isFetching, hasActiveFilters, error, deleteMutation, updateMutation } =
    useOrders(page, debouncedFilters);

  const theme = useTheme();

  const handleSort = (column: keyof Order) => {
    const isAsc = orderBy === column && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const handleFiltersChange = (newFilters: OrderFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setEditModalOpen(true);
    handleCloseMenu();
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedOrder(null);
  };

  const handleDelete = (orderId: number) => {
    setSelectedOrderId(orderId);
    setConfirmationOpen(true);
    handleCloseMenu();
  };

  const handleChangeStatus = (statusId: number) => {
    setPendingStatusId(statusId);
    setIsStatusChangeConfirmOpen(true);
    handleCloseMenu();
  };

  const handleConfirmChangeStatus = () => {
    if (!selectedOrder || pendingStatusId === null) return;

    updateMutation.mutate({
      orderId: selectedOrder.id,
      updatedOrder: {
        cliente: selectedOrder.cliente.id,
        agentes: selectedOrder.agentes.map((a) => a.id),
        titulo: selectedOrder.titulo,
        prioridad: selectedOrder.prioridad,
        estado: pendingStatusId,
      },
    });

    setIsStatusChangeConfirmOpen(false);
    setPendingStatusId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedOrderId) {
      deleteMutation.mutate(selectedOrderId, {
        onSuccess: () => {
          toast.success('Tarea eliminada exitosamente');
          setConfirmationOpen(false);
        },
      });
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleOpenChat = (order: Order) => {
    setSelectedOrder(order);
    setOpenChat(true);
    handleCloseMenu();
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const showLoading = isLoading || isFetching;
  const totalPages = data ? Math.ceil(data.count / 10) : 0;

  const sortedOrders = useMemo(() => {
    const filteredOrders = data?.results ?? [];

    if (!orderBy) return filteredOrders;

    return [...filteredOrders].sort((a, b) => {
      let aValue: any = a[orderBy];
      let bValue: any = b[orderBy];

      if (orderBy === 'cliente' && a.cliente && b.cliente) {
        aValue = a.cliente.username;
        bValue = b.cliente.username;
      } else if (orderBy === 'created_at') {
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
      } else if (orderBy === 'agentes') {
        aValue = a.agentes.length;
        bValue = b.agentes.length;
      }

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return orderDirection === 'asc' ? comparison : -comparison;
    });
  }, [data?.results, orderBy, orderDirection]);

  return (
    <Stack sx={{ px: 3 }} spacing={1}>
      <Typography
        variant="h4"
        sx={{ fontFamily: `${firaSans.style.fontFamily} !important`, lineHeight: 1.3, pl: 1 }}
        gutterBottom
      >
        Administrar Tareas
      </Typography>

      <OrdersFilter
        filters={filters}
        onFiltersChange={handleFiltersChange}
        hasActiveFilters={hasActiveFilters}
      />

      {showLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={400}
          flexDirection="column"
          gap={2}
        >
          <Typography color="error" variant="h6">
            Error al cargar las órdenes
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {error.message}
          </Typography>
        </Box>
      ) : !data?.results.length ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <Typography>No se encontraron resultados con los parámetros otorgados</Typography>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <SortableTableCell
                    column="titulo"
                    label="Título"
                    orderBy={orderBy}
                    orderDirection={orderDirection}
                    onSort={handleSort}
                  />
                  <SortableTableCell
                    column="cliente"
                    label="Cliente"
                    orderBy={orderBy}
                    orderDirection={orderDirection}
                    onSort={handleSort}
                  />
                  <SortableTableCell
                    column="estado"
                    label="Estado"
                    orderBy={orderBy}
                    orderDirection={orderDirection}
                    onSort={handleSort}
                  />
                  <SortableTableCell
                    column="prioridad"
                    label="Prioridad"
                    orderBy={orderBy}
                    orderDirection={orderDirection}
                    onSort={handleSort}
                  />
                  <SortableTableCell
                    column="agentes"
                    label="Agentes Asignados"
                    orderBy={orderBy}
                    orderDirection={orderDirection}
                    onSort={handleSort}
                  />
                  <SortableTableCell
                    column="tags"
                    label="Categorías"
                    orderBy={orderBy}
                    orderDirection={orderDirection}
                    onSort={handleSort}
                  />
                  <SortableTableCell
                    column="created_at"
                    label="Fecha de Creación"
                    orderBy={orderBy}
                    orderDirection={orderDirection}
                    onSort={handleSort}
                  />
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    sx={{
                      '&:hover': {
                        bgcolor: theme.palette.action.hover,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                      },
                    }}
                  >
                    <TableCell
                      onClick={() => handleOpenChat(order)}
                      sx={{
                        maxWidth: 250,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        '& .title-text': {
                          textDecoration: 'none',
                          transition: 'text-decoration 0.2s ease',
                        },
                        '&:hover .title-text': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      <Tooltip title={order.titulo} arrow placement="top">
                        <Typography noWrap component="span" className="title-text">
                          {order.titulo}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{order.cliente.username}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.estado_display ?? 'N/A'}
                        color={statusChipColorMap[order.estado as OrderStatusEnum] ?? 'default'}
                        icon={getStatusIcon(order.estado as OrderStatusEnum)}
                        size="small"
                        variant="soft"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.prioridad_display}
                        color={priorityChipColorMap[order.prioridad]}
                        icon={getPriorityIcon(order.prioridad)}
                        size="small"
                        variant="soft"
                      />
                    </TableCell>
                    <TableCell>
                      {order.agentes.length > 0 ? (
                        <Stack direction="row" flexWrap="wrap" spacing={0.5}>
                          {order.agentes.map((agent) => (
                            <Chip
                              key={agent.id}
                              label={agent.username}
                              size="small"
                              variant="outlined"
                              color="secondary"
                              icon={<SupportAgent />}
                            />
                          ))}
                        </Stack>
                      ) : (
                        <Chip
                          label="Sin Asignar"
                          size="small"
                          color="warning"
                          icon={<Warning />}
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {order.tags && order.tags.length > 0 ? (
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {order.tags.map((tag, idx) => (
                            <Chip
                              variant="soft"
                              color="secondary"
                              key={idx}
                              label={tag.tag}
                              size="small"
                            />
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Sin Categorias
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{fDate(order.created_at, 'DD-MM-YYYY h:mm a')}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                          setSelectedOrder(order);
                        }}
                        size="small"
                      >
                        <MoreVert />
                      </IconButton>

                      <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleCloseMenu}
                        slotProps={{
                          paper: {
                            style: {
                              width: '17ch',
                              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
                            },
                          },
                        }}
                      >
                        {(selectedOrder?.estado === 3 || selectedOrder?.estado === 2) && (
                          <MenuItem onClick={() => handleChangeStatus(1)}>
                            <Sync fontSize="small" color="warning" sx={{ mr: 1 }} /> Re abrir
                          </MenuItem>
                        )}

                        {selectedOrder?.estado === 1 && (
                          <>
                            <MenuItem onClick={() => handleChangeStatus(2)}>
                              <CheckCircle fontSize="small" color="success" sx={{ mr: 1 }} />{' '}
                              Finalizar
                            </MenuItem>

                            <MenuItem onClick={() => handleChangeStatus(3)}>
                              <Cancel fontSize="small" color="error" sx={{ mr: 1 }} /> Cancelar
                            </MenuItem>
                          </>
                        )}

                        <Divider />

                        <MenuItem onClick={() => handleOpenChat(order)}>
                          <Chat fontSize="small" color="info" sx={{ mr: 1 }} /> Ver Conversación
                        </MenuItem>

                        <MenuItem onClick={() => handleEdit(order)}>
                          <Edit fontSize="small" color="warning" sx={{ mr: 1 }} /> Editar
                        </MenuItem>

                        <MenuItem onClick={() => handleDelete(order.id)}>
                          <Delete fontSize="small" color="error" sx={{ mr: 1 }} /> Eliminar
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}

      <OrderForm
        open={editModalOpen}
        onClose={handleCloseEditModal}
        type="edit"
        orderId={selectedOrder?.id ?? 0}
        defaultValues={{
          cliente: selectedOrder?.cliente.id,
          agentes: selectedOrder?.agentes.map((agent) => agent.id) ?? [],
          titulo: selectedOrder?.titulo,
          estado: selectedOrder?.estado,
          prioridad: selectedOrder?.prioridad,
        }}
      />

      {selectedOrder && (
        <OrderChat
          orderId={selectedOrder.id}
          open={openChat}
          onClose={() => {
            setOpenChat(false);
            setSelectedOrder(null);
          }}
        />
      )}

      <ConfirmationModal
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Estás seguro que deseas eliminar esta tarea?"
        content="Esta acción eliminará la tarea seleccionada. ¿Deseas continuar?"
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />

      <ConfirmationModal
        open={isStatusChangeConfirmOpen}
        onClose={() => setIsStatusChangeConfirmOpen(false)}
        onConfirm={handleConfirmChangeStatus}
        title="¿Estás seguro que deseas cambiar el estado?"
        content="Esta acción actualizará el estado de la tarea seleccionada. ¿Deseas continuar?"
        confirmText="Sí, cambiar estado"
        cancelText="Cancelar"
      />

      <CreateButton type="order" />
    </Stack>
  );
}
