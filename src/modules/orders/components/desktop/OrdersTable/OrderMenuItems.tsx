import type { Order } from 'src/modules/orders/interfaces';

import { Divider, MenuItem } from '@mui/material';
import {
  Chat,
  Edit,
  Sync,
  Group,
  Cancel,
  Delete,
  CheckCircle,
  PictureAsPdf,
} from '@mui/icons-material';

import { generateOrderPdf } from 'src/modules/orders/utils/generateOrderPdf';

import type { OrderStatusEnum } from '../../../enums';

type Props = {
  order: Order;
  onAssignAgents: () => void;
  onChangeStatus: (status: OrderStatusEnum) => void;
  onOpenChat: () => void;
  onEdit: () => void;
  onDelete: () => void;
  closeMenu: () => void;
};

export const OrderMenuItems = ({
  order,
  onAssignAgents,
  onChangeStatus,
  onOpenChat,
  onEdit,
  onDelete,
  closeMenu,
}: Props) => {
  const handleAction = (callback: () => void) => {
    callback();
    closeMenu();
  };

  return (
    <>
      <MenuItem
        onClick={() => {
          onAssignAgents();
          closeMenu();
        }}
      >
        <Group fontSize="small" color="secondary" sx={{ mr: 1 }} />
        {order.agentes.length === 0 ? 'Asignar Agentes' : 'Editar Agentes'}
      </MenuItem>

      <MenuItem onClick={() => handleAction(() => generateOrderPdf(order))}>
        <PictureAsPdf fontSize="small" color="error" sx={{ mr: 1 }} />
        Generar Remito
      </MenuItem>

      {order.estado === 3 || order.estado === 2 ? (
        <MenuItem onClick={() => handleAction(() => onChangeStatus(1))}>
          <Sync fontSize="small" color="warning" sx={{ mr: 1 }} /> Re abrir
        </MenuItem>
      ) : null}

      {order.estado === 1 ? (
        <>
          <MenuItem onClick={() => handleAction(() => onChangeStatus(2))}>
            <CheckCircle fontSize="small" color="success" sx={{ mr: 1 }} /> Finalizar
          </MenuItem>
          <MenuItem onClick={() => handleAction(() => onChangeStatus(3))}>
            <Cancel fontSize="small" color="error" sx={{ mr: 1 }} /> Cancelar
          </MenuItem>
        </>
      ) : null}

      <Divider />

      <MenuItem onClick={() => handleAction(onOpenChat)}>
        <Chat fontSize="small" color="info" sx={{ mr: 1 }} /> Ver Conversación
      </MenuItem>
      <MenuItem onClick={() => handleAction(onEdit)}>
        <Edit fontSize="small" color="warning" sx={{ mr: 1 }} /> Editar
      </MenuItem>
      <MenuItem onClick={() => handleAction(onDelete)}>
        <Delete fontSize="small" color="error" sx={{ mr: 1 }} /> Eliminar
      </MenuItem>
    </>
  );
};
