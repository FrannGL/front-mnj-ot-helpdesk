import type { Tag, Order } from 'src/modules/orders/interfaces';

import { useMemo, useState } from 'react';

import { Warning, MoreVert, SupportAgent } from '@mui/icons-material';
import {
  Box,
  Menu,
  Chip,
  Paper,
  Table,
  Stack,
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

import { fDate } from 'src/shared/utils/format-time';
import { ConfirmationModal } from 'src/shared/components/custom';

import OrderForm from '../../OrderForm';
import { OrderChat } from '../../OrderChat';
import { DesktopFilterMenu } from '../Filters';
import { useAdminOrders } from '../../../hooks';
import { OrderMenuItems } from './OrderMenuItems';
import { SortedTableCell } from './SortableColumn';
import AssignAgentsDialog from './AssignAgentsDialog';
import {
  getStatusIcon,
  getPriorityIcon,
  statusChipColorMap,
  priorityChipColorMap,
} from '../../../utils';

import type { OrderStatusEnum } from '../../../enums';

export type OrderTableColumn = {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
  width?: string | number;
};

const ORDERS_TABLE_COLUMNS: OrderTableColumn[] = [
  { id: 'id', label: 'Código', width: '50px' },
  { id: 'titulo', label: 'Título', width: '250px' },
  { id: 'cliente', label: 'Cliente' },
  { id: 'edificio', label: 'Edificio', width: '250px' },
  { id: 'sector', label: 'Sector' },
  { id: 'estado', label: 'Estado', align: 'center' },
  { id: 'prioridad', label: 'Prioridad', align: 'center' },
  { id: 'agentes', label: 'Agentes Asignados' },
  { id: 'tags', label: 'Categorías' },
  {
    id: 'created_at',
    label: 'Fecha de Creación',
    width: '190px',
  },
];

const OrdersTable = () => {
  const {
    orderBy,
    orderDirection,
    page,
    selectedOrder,
    confirmationOpen,
    editModalOpen,
    isStatusChangeConfirmOpen,
    showLoading,
    totalPages,
    orders,
    filters,
    hasActiveFilters,
    openChat,
    setSelectedOrder,
    setOpenChat,
    handleSort,
    handlePageChange,
    handleEdit,
    handleDelete,
    handleOpenChat,
    handleChangeStatus,
    handleAssignAgents,
    handleFiltersChange,
    handleCloseEditModal,
    handleConfirmDelete,
    handleConfirmChangeStatus,
    setConfirmationOpen,
    setIsStatusChangeConfirmOpen,
  } = useAdminOrders();

  const [anchorActionsEl, setAnchorActionsEl] = useState<HTMLElement | null>(null);
  const [assignAgentsModalOpen, setAssignAgentsModalOpen] = useState(false);

  const theme = useTheme();
  const open = Boolean(anchorActionsEl);

  const handleOpenActionsMenu = (event: React.MouseEvent<HTMLElement>, order: Order) => {
    setAnchorActionsEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleCloseActionsMenu = () => {
    setAnchorActionsEl(null);
  };

  const handleAssignAgentsSubmit = (values: { agentes: number[] }) => {
    if (selectedOrder) {
      handleAssignAgents(selectedOrder.id, values.agentes);
      setAssignAgentsModalOpen(false);
    }
  };

  const sortedOrders = useMemo(() => {
    if (!orderBy) return orders;

    return [...orders].sort((a, b) => {
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
  }, [orders, orderBy, orderDirection]);

  const renderAgentsCell = (agents: Order['agentes']) => {
    if (agents.length > 0) {
      return (
        <Stack direction="row" flexWrap="wrap" spacing={0.5}>
          {agents.map((agent) => (
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
      );
    }

    return (
      <Chip
        label="Sin Asignar"
        size="small"
        color="warning"
        icon={<Warning />}
        variant="outlined"
      />
    );
  };

  const renderTagsCell = (tags: Tag[]) => {
    if (tags && tags.length > 0) {
      return (
        <Stack direction="row" spacing={0.5} flexWrap="wrap">
          {tags.map((tag, idx) => (
            <Chip variant="soft" color="secondary" key={idx} label={tag.tag} size="small" />
          ))}
        </Stack>
      );
    }

    return (
      <Typography variant="body2" color="text.secondary">
        Sin Categorias
      </Typography>
    );
  };

  return (
    <>
      <DesktopFilterMenu
        filters={filters}
        onFiltersChange={handleFiltersChange}
        hasActiveFilters={hasActiveFilters}
      />

      {showLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {ORDERS_TABLE_COLUMNS.map((column) => (
                    <SortedTableCell
                      key={column.id}
                      column={column}
                      orderBy={orderBy}
                      orderDirection={orderDirection}
                      onSort={handleSort as (property: string) => void}
                    />
                  ))}
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!sortedOrders.length ? (
                  <TableRow>
                    <TableCell colSpan={ORDERS_TABLE_COLUMNS.length + 1} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        No se encontraron resultados con los filtros aplicados
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedOrders.map((order) => (
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
                        <Typography noWrap component="span" variant="body2" className="title-text">
                          {`#OT${order.id}`}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={order.titulo} arrow placement="top">
                          <Typography noWrap component="span" className="title-text">
                            {order.titulo}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{order.cliente.username}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {[
                          order.edificio_display,
                          order.piso != null ? `Piso ${order.piso}` : null,
                          order.oficina ? `Oficina ${order.oficina}` : null,
                        ]
                          .filter(Boolean)
                          .join(' - ')}
                      </TableCell>
                      <TableCell>{order.sector_display}</TableCell>
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
                      <TableCell>{renderAgentsCell(order.agentes)}</TableCell>
                      <TableCell>{renderTagsCell(order.tags)}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {fDate(order.created_at, 'DD-MM-YYYY h:mm a')}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={(e) => handleOpenActionsMenu(e, order)} size="small">
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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

      <Menu
        id="order-actions-menu"
        anchorEl={anchorActionsEl}
        open={open}
        onClose={handleCloseActionsMenu}
        slotProps={{
          paper: {
            style: {
              width: '17ch',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
            },
          },
        }}
      >
        {selectedOrder && (
          <OrderMenuItems
            order={selectedOrder}
            onAssignAgents={() => setAssignAgentsModalOpen(true)}
            onChangeStatus={(statusId) => handleChangeStatus(statusId, handleCloseActionsMenu)}
            onOpenChat={() => handleOpenChat(selectedOrder)}
            onEdit={() => handleEdit(selectedOrder)}
            onDelete={() => handleDelete(selectedOrder.id, handleCloseActionsMenu)}
            closeMenu={handleCloseActionsMenu}
          />
        )}
      </Menu>

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

      <AssignAgentsDialog
        open={assignAgentsModalOpen}
        onClose={() => {
          setAssignAgentsModalOpen(false);
        }}
        onSubmit={handleAssignAgentsSubmit}
        initialValues={{ agentes: selectedOrder?.agentes?.map((a) => a.id) || [] }}
        title={selectedOrder?.agentes?.length ? 'Editar Agentes Asignados' : 'Asignar Agentes'}
        isEditing={!!selectedOrder?.agentes?.length}
      />

      <OrderForm
        open={editModalOpen}
        onClose={handleCloseEditModal}
        type="edit"
        orderId={selectedOrder?.id ?? 0}
        defaultValues={{
          cliente: selectedOrder?.cliente.id,
          titulo: selectedOrder?.titulo,
          estado: selectedOrder?.estado,
          prioridad: selectedOrder?.prioridad,
          edificio: selectedOrder?.edificio,
          piso: selectedOrder?.piso,
          oficina: selectedOrder?.oficina,
          sector: selectedOrder?.sector,
          tags: selectedOrder?.tags.map((tag) => tag.id) ?? [],
        }}
      />

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
    </>
  );
};

export default OrdersTable;
