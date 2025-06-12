'use client';

import { Fira_Sans } from 'next/font/google';

import { Box, Stack, Typography } from '@mui/material';

import { CreateButton } from 'src/shared/components/custom/CreateButton';
import { ConfirmationModal } from 'src/shared/components/custom/ConfirmationModal';

import { OrderChat } from '../../orders/components';
import { OrdersTable } from './OrdersTable/OrdersTable';
import { useAdminOrders } from '../hooks/useAdminOrders';
import { OrderForm } from '../../orders/components/OrderForm';
import { OrdersFilter } from '../../orders/components/OrdersFilter';

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
});

export function AdminOrders() {
  const {
    orderBy,
    orderDirection,
    page,
    confirmationOpen,
    editModalOpen,
    openChat,
    isStatusChangeConfirmOpen,
    selectedOrder,
    filters,
    showLoading,
    totalPages,
    orders,
    error,
    hasActiveFilters,
    handleSort,
    handleFiltersChange,
    handlePageChange,
    handleEdit,
    handleDelete,
    handleOpenChat,
    handleChangeStatus,
    handleCloseEditModal,
    handleConfirmDelete,
    handleConfirmChangeStatus,
    handleAssignAgents,
    setConfirmationOpen,
    setIsStatusChangeConfirmOpen,
    setOpenChat,
    setSelectedOrder,
  } = useAdminOrders();

  if (error) {
    return (
      <Stack sx={{ px: 3 }} spacing={1}>
        <Typography
          variant="h4"
          sx={{ fontFamily: `${firaSans.style.fontFamily} !important`, lineHeight: 1.3, pl: 1 }}
          gutterBottom
        >
          Administrar Tareas
        </Typography>
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
      </Stack>
    );
  }

  if (!orders.length) {
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
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <Typography>No se encontraron resultados con los parámetros otorgados</Typography>
        </Box>
        <CreateButton type="order" />
      </Stack>
    );
  }

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

      <OrdersTable
        orders={orders}
        orderBy={orderBy}
        orderDirection={orderDirection}
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
        loading={showLoading}
        onSort={handleSort}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onOpenChat={handleOpenChat}
        onChangeStatus={handleChangeStatus}
        onAssignAgents={handleAssignAgents}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
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
          tags: selectedOrder?.tags.map((tag) => tag.id) ?? [],
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
