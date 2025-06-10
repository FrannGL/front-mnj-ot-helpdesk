import type { Order } from 'src/modules/orders/interfaces';
import type { OrderStatusEnum } from 'src/modules/orders/enums';

import { useMemo, useState } from 'react';

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
  Typography,
  TableContainer,
} from '@mui/material';

import { fDate } from 'src/shared/utils/format-time';
import {
  getStatusIcon,
  getPriorityIcon,
  statusChipColorMap,
  priorityChipColorMap,
} from 'src/modules/orders/utils';

import { SortableTableCell } from './SortedTableCell';

interface OrdersTableProps {
  orders: Order[];
  orderBy: keyof Order | '';
  orderDirection: 'asc' | 'desc';
  onSort: (column: keyof Order) => void;
  onEdit: (order: Order) => void;
  onDelete: (orderId: number) => void;
  onOpenChat: (order: Order) => void;
  onChangeStatus: (statusId: number) => void;
}

export function OrdersTable({
  orders,
  orderBy,
  orderDirection,
  onSort,
  onEdit,
  onDelete,
  onOpenChat,
  onChangeStatus,
}: OrdersTableProps) {
  const [anchorActionsEl, setAnchorActionsEl] = useState<HTMLElement | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const theme = useTheme();
  const open = Boolean(anchorActionsEl);

  const handleCloseActionsMenu = () => {
    setAnchorActionsEl(null);
    setSelectedOrder(null);
  };

  const handleOpenActionsMenu = (action: () => void) => {
    action();
    handleCloseActionsMenu();
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

  const renderStatusMenu = (order: Order) => {
    const menuItems = [];

    if (order.estado === 3 || order.estado === 2) {
      menuItems.push(
        <MenuItem key="reopen" onClick={() => handleOpenActionsMenu(() => onChangeStatus(1))}>
          <Sync fontSize="small" color="warning" sx={{ mr: 1 }} /> Re abrir
        </MenuItem>
      );
    }

    if (order.estado === 1) {
      menuItems.push(
        <MenuItem key="complete" onClick={() => handleOpenActionsMenu(() => onChangeStatus(2))}>
          <CheckCircle fontSize="small" color="success" sx={{ mr: 1 }} /> Finalizar
        </MenuItem>,
        <MenuItem key="cancel" onClick={() => handleOpenActionsMenu(() => onChangeStatus(3))}>
          <Cancel fontSize="small" color="error" sx={{ mr: 1 }} /> Cancelar
        </MenuItem>
      );
    }

    return menuItems;
  };

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

  const renderTagsCell = (tags: Order['tags']) => {
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
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <SortableTableCell
                column="titulo"
                label="Título"
                orderBy={orderBy}
                orderDirection={orderDirection}
                onSort={onSort}
              />
              <SortableTableCell
                column="cliente"
                label="Cliente"
                orderBy={orderBy}
                orderDirection={orderDirection}
                onSort={onSort}
              />
              <SortableTableCell
                column="estado"
                label="Estado"
                orderBy={orderBy}
                orderDirection={orderDirection}
                onSort={onSort}
              />
              <SortableTableCell
                column="prioridad"
                label="Prioridad"
                orderBy={orderBy}
                orderDirection={orderDirection}
                onSort={onSort}
              />
              <SortableTableCell
                column="agentes"
                label="Agentes Asignados"
                orderBy={orderBy}
                orderDirection={orderDirection}
                onSort={onSort}
              />
              <SortableTableCell
                column="tags"
                label="Categorías"
                orderBy={orderBy}
                orderDirection={orderDirection}
                onSort={onSort}
              />
              <SortableTableCell
                column="created_at"
                label="Fecha de Creación"
                orderBy={orderBy}
                orderDirection={orderDirection}
                onSort={onSort}
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
                  onClick={() => onOpenChat(order)}
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
                <TableCell>{renderAgentsCell(order.agentes)}</TableCell>
                <TableCell>{renderTagsCell(order.tags)}</TableCell>
                <TableCell>{fDate(order.created_at, 'DD-MM-YYYY h:mm a')}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => {
                      setAnchorActionsEl(e.currentTarget);
                      setSelectedOrder(order);
                    }}
                    size="small"
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
        {selectedOrder && renderStatusMenu(selectedOrder)}

        {selectedOrder && (
          <>
            <Divider />
            <MenuItem onClick={() => handleOpenActionsMenu(() => onOpenChat(selectedOrder))}>
              <Chat fontSize="small" color="info" sx={{ mr: 1 }} /> Ver Conversación
            </MenuItem>
            <MenuItem onClick={() => handleOpenActionsMenu(() => onEdit(selectedOrder))}>
              <Edit fontSize="small" color="warning" sx={{ mr: 1 }} /> Editar
            </MenuItem>
            <MenuItem onClick={() => handleOpenActionsMenu(() => onDelete(selectedOrder.id))}>
              <Delete fontSize="small" color="error" sx={{ mr: 1 }} /> Eliminar
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
}
