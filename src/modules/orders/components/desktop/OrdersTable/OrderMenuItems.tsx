import type { Order } from 'src/modules/orders/interfaces';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

import {
  Chat,
  Edit,
  Sync,
  Close,
  Group,
  Cancel,
  Delete,
  Download,
  AttachFile,
  CheckCircle,
  PictureAsPdf,
} from '@mui/icons-material';
import {
  Menu,
  Button,
  Dialog,
  Divider,
  MenuItem,
  IconButton,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { request } from 'src/services/request';
import { downloadAttachment } from 'src/modules/orders/utils';
import { isAdmin, isSuperAdmin } from 'src/shared/utils/verifyUserRole';
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
  const superAdmin = isSuperAdmin(publicMetadata);

  const [attachmentsAnchor, setAttachmentsAnchor] = useState<null | HTMLElement>(null);
  const [previewFile, setPreviewFile] = useState<{
    url: string;
    name: string;
    messageId: number;
  } | null>(null);

  const allAttachments = order.mensajes.flatMap((mensaje) =>
    mensaje.adjuntos.map((adjunto) => ({
      ...adjunto,
      messageId: mensaje.id,
    }))
  );

  const hasAttachments = allAttachments.length > 0;

  const handleAttachmentsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAttachmentsAnchor(event.currentTarget);
  };

  const handleAttachmentsClose = () => {
    setAttachmentsAnchor(null);
  };

  const handlePreview = async (fileUrl: string, fileName: string, messageId: number) => {
    try {
      const response = await request(fileUrl, 'GET', undefined, 'blob');
      if (response.error) {
        console.error('Error fetching file:', response.error);
        return;
      }
      const blobUrl = URL.createObjectURL(response.data);
      setPreviewFile({
        url: blobUrl,
        name: fileName,
        messageId,
      });
      handleAttachmentsClose();
    } catch (error) {
      console.error('Error in handlePreview:', error);
    }
  };

  const handleClosePreview = () => {
    if (previewFile?.url) {
      URL.revokeObjectURL(previewFile.url);
    }
    setPreviewFile(null);
    closeMenu();
  };

  return (
    <>
      {hasAttachments && (
        <MenuItem onClick={handleAttachmentsClick}>
          <AttachFile fontSize="small" color="primary" sx={{ mr: 1 }} /> Ver Adjuntos
        </MenuItem>
      )}

      {(admin || superAdmin) && (
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
        {admin || superAdmin ? 'Generar Remito' : 'Ver Remito'}
      </MenuItem>

      {(admin || superAdmin) && (order.estado === 2 || order.estado === 3) && (
        <MenuItem onClick={() => onChangeStatus(1)}>
          <Sync fontSize="small" color="warning" sx={{ mr: 1 }} /> Reabrir
        </MenuItem>
      )}

      {(admin || superAdmin) && order.estado === 1 && (
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

      {(admin || superAdmin) && (
        <>
          <MenuItem onClick={() => onEdit()}>
            <Edit fontSize="small" color="warning" sx={{ mr: 1 }} /> Editar
          </MenuItem>
          <MenuItem onClick={() => onDelete()}>
            <Delete fontSize="small" color="error" sx={{ mr: 1 }} /> Eliminar
          </MenuItem>
        </>
      )}

      <Menu
        anchorEl={attachmentsAnchor}
        open={Boolean(attachmentsAnchor)}
        onClose={handleAttachmentsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {allAttachments.map((adjunto) => {
          const fileName = adjunto.archivo.split('/').pop() || 'archivo';
          return (
            <MenuItem
              key={adjunto.id}
              onClick={() => handlePreview(adjunto.archivo, fileName, adjunto.messageId)}
            >
              <AttachFile fontSize="small" sx={{ mr: 1 }} />
              {fileName}
            </MenuItem>
          );
        })}
      </Menu>

      {previewFile && (
        <Dialog
          open={!!previewFile}
          onClose={handleClosePreview}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: { height: '80vh', overflow: 'hidden' },
          }}
        >
          <DialogTitle
            sx={{
              m: 0,
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">{previewFile.name}</Typography>
            <IconButton onClick={handleClosePreview}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 0, height: '100%' }}>
            <iframe
              src={previewFile.url}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title={previewFile.name}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePreview} color="inherit">
              Cerrar
            </Button>
            <Button
              variant="contained"
              onClick={() => downloadAttachment(previewFile.messageId, previewFile.name)}
              startIcon={<Download />}
            >
              Descargar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
