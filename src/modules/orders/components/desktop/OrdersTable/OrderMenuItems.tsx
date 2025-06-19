import type { Order } from 'src/modules/orders/interfaces';

import { useUser } from '@clerk/nextjs';

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

import { isAdmin } from 'src/shared/utils/verifyUserRole';
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
  const { user } = useUser();
  const publicMetadata = user?.publicMetadata || {};
  const admin = isAdmin(publicMetadata);

  return (
    <>
      {admin && (
        <MenuItem
          onClick={() => {
            onAssignAgents();
            closeMenu();
          }}
        >
          <Group fontSize="small" color="secondary" sx={{ mr: 1 }} />
          {order.agentes.length === 0 ? 'Asignar Agentes' : 'Editar Agentes'}
        </MenuItem>
      )}

      <MenuItem onClick={() => generateOrderPdf(order)}>
        <PictureAsPdf fontSize="small" color="error" sx={{ mr: 1 }} />
        {admin ? 'Generar Remito' : 'Ver Remito'}
      </MenuItem>

      {admin && (order.estado === 2 || order.estado === 3) && (
        <MenuItem onClick={() => onChangeStatus(1)}>
          <Sync fontSize="small" color="warning" sx={{ mr: 1 }} /> Reabrir
        </MenuItem>
      )}

      {admin && order.estado === 1 && (
        <>
          <MenuItem onClick={() => onChangeStatus(2)}>
            <CheckCircle fontSize="small" color="success" sx={{ mr: 1 }} /> Finalizar
          </MenuItem>
          <MenuItem onClick={() => onChangeStatus(3)}>
            <Cancel fontSize="small" color="error" sx={{ mr: 1 }} /> Cancelar
          </MenuItem>
        </>
      )}

      <Divider />

      <MenuItem onClick={() => onOpenChat()}>
        <Chat fontSize="small" color="info" sx={{ mr: 1 }} /> Ver Conversación
      </MenuItem>

      {admin && (
        <>
          <MenuItem onClick={() => onEdit()}>
            <Edit fontSize="small" color="warning" sx={{ mr: 1 }} /> Editar
          </MenuItem>
          <MenuItem onClick={() => onDelete()}>
            <Delete fontSize="small" color="error" sx={{ mr: 1 }} /> Eliminar
          </MenuItem>
        </>
      )}
    </>
  );
};
