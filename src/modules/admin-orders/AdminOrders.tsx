'use client';

import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { Fira_Sans } from 'next/font/google';

import { Edit, Delete, SupportAgent } from '@mui/icons-material';
import {
  Box,
  Chip,
  Table,
  Paper,
  Stack,
  TableRow,
  useTheme,
  TableBody,
  TableCell,
  TableHead,
  Pagination,
  IconButton,
  Typography,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { CreateButton } from 'src/components/CreateButton';
import { ConfirmationModal } from 'src/components/ConfirmationModal';

import { useOrders } from '../orders/hooks/useOrders';
import { OrderForm } from '../orders/components/OrderForm';
import { OrdersFilter } from '../orders/components/OrdersFilter';
import {
  applyFilters,
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
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrders] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<OrderFilters>({
    status: undefined,
    priority: undefined,
    assignedTo: undefined,
    cliente: undefined,
    searchTerm: undefined,
  });

  const { data, isLoading, deleteMutation, hasActiveFilters } = useOrders(page);

  const theme = useTheme();

  const handleFiltersChange = (newFilters: OrderFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrders(order);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedOrders(null);
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

  const filteredOrders = useMemo(
    () => (data?.results ? applyFilters(data.results, filters) : []),
    [data?.results, filters]
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data?.results.length) {
    return (
      <>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <Typography>No hay tareas disponibles</Typography>
        </Box>
        <CreateButton type="order" />
      </>
    );
  }

  const totalPages = data ? Math.ceil(data.count / 10) : 0;

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
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Prioridad</TableCell>
              <TableCell>Agentes Asignados</TableCell>
              <TableCell>Fecha de Creación</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
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
                  sx={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {order.titulo}
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
                </TableCell>
                <TableCell> {fDate(order.created_at, 'DD-MM-YYYY h:mm a')} </TableCell>
                <TableCell>
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

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>

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

      <ConfirmationModal
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <CreateButton type="order" />
    </Stack>
  );
}
