'use client';

import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { Fira_Sans } from 'next/font/google';

import { Chat, Edit, Delete, Warning, SupportAgent } from '@mui/icons-material';
import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  Tooltip,
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

import { fDate } from 'src/utils/format-time';

import { CreateButton } from 'src/components/CreateButton';
import { ConfirmationModal } from 'src/components/ConfirmationModal';

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
  const [orderBy, setOrderBy] = useState<keyof Order | ''>('');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openChat, setOpenChat] = useState(false);
  const [filters, setFilters] = useState<OrderFilters>({
    cliente: undefined,
    status: undefined,
    priority: undefined,
    assignedTo: undefined,
    searchTerm: undefined,
  });

  const debouncedSearchTerm = useDebouncedValue(filters.searchTerm, 1000);

  const debouncedFilters = useMemo(
    () => ({ ...filters, searchTerm: debouncedSearchTerm }),
    [filters, debouncedSearchTerm]
  );

  const { data, isLoading, isFetching, hasActiveFilters, error, deleteMutation } = useOrders(
    page,
    debouncedFilters
  );

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
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedOrder(null);
  };

  const handleDelete = (orderId: number) => {
    setSelectedOrderId(orderId);
    setConfirmationOpen(true);
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
                    <TableCell>{fDate(order.created_at, 'DD-MM-YYYY h:mm a')}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenChat(order)} color="info" size="small">
                        <Chat />
                      </IconButton>
                      <IconButton
                        onClick={() => handleEdit(order)}
                        color={theme.palette.mode === 'dark' ? 'inherit' : 'primary'}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(order.id)} color="error" size="small">
                        <Delete />
                      </IconButton>
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
      />

      <CreateButton type="order" />
    </Stack>
  );
}
