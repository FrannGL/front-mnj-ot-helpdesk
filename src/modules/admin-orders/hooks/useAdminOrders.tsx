import { toast } from 'sonner';
import { useMemo, useState } from 'react';

import { useDebouncedValue } from '../../orders/hooks';
import { useOrders } from '../../orders/hooks/useOrders';

import type { Order } from '../../orders/interfaces';
import type { OrderFilters } from '../../orders/types';

export function useAdminOrders() {
  const [orderBy, setOrderBy] = useState<keyof Order | ''>('');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [isStatusChangeConfirmOpen, setIsStatusChangeConfirmOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pendingStatusId, setPendingStatusId] = useState<number | null>(null);

  const [filters, setFilters] = useState<OrderFilters>({
    cliente: undefined,
    status: undefined,
    priority: undefined,
    assignedTo: undefined,
    searchTerm: undefined,
    tags: undefined,
  });

  const debouncedSearchTerm = useDebouncedValue(filters.searchTerm, 1000);
  const debouncedFilters = useMemo(
    () => ({ ...filters, searchTerm: debouncedSearchTerm }),
    [filters, debouncedSearchTerm]
  );

  const { data, isLoading, isFetching, hasActiveFilters, error, deleteMutation, updateMutation } =
    useOrders(page, debouncedFilters);

  const handleSort = (column: keyof Order) => {
    const isAsc = orderBy === column && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const handleFiltersChange = (newFilters: OrderFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setEditModalOpen(true);
  };

  const handleDelete = (orderId: number) => {
    const order = data?.results.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setSelectedOrderId(orderId);
      setConfirmationOpen(true);
    }
  };

  const handleOpenChat = (order: Order) => {
    setSelectedOrder(order);
    setOpenChat(true);
  };

  const handleChangeStatus = (statusId: number) => {
    if (selectedOrder) {
      setPendingStatusId(statusId);
      setIsStatusChangeConfirmOpen(true);
    }
  };

  const handleAssignAgents = (orderId: number, agentes: number[]) => {
    const order = data?.results.find((o) => o.id === orderId);
    if (!order) return;

    updateMutation.mutate(
      {
        orderId,
        updatedOrder: {
          cliente: order.cliente.id,
          titulo: order.titulo,
          prioridad: order.prioridad,
          estado: order.estado,
          agentes,
        },
      },
      {
        onSuccess: () => {
          toast.success('Agentes asignados exitosamente');
          setSelectedOrder(null);
        },
      }
    );
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedOrder(null);
  };

  const handleConfirmDelete = () => {
    if (selectedOrderId) {
      deleteMutation.mutate(selectedOrderId, {
        onSuccess: () => {
          toast.success('Tarea eliminada exitosamente');
          setConfirmationOpen(false);
          setSelectedOrderId(null);
        },
      });
    }
  };

  const handleConfirmChangeStatus = () => {
    if (!selectedOrder || pendingStatusId === null) return;

    updateMutation.mutate({
      orderId: selectedOrder.id,
      updatedOrder: {
        cliente: selectedOrder.cliente.id,
        titulo: selectedOrder.titulo,
        prioridad: selectedOrder.prioridad,
        estado: pendingStatusId,
      },
    });

    setIsStatusChangeConfirmOpen(false);
    setPendingStatusId(null);
  };

  const showLoading = isLoading || isFetching;
  const totalPages = data ? Math.ceil(data.count / 10) : 0;
  const orders = data?.results ?? [];

  return {
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
    handleAssignAgents,
    handleCloseEditModal,
    handleConfirmDelete,
    handleConfirmChangeStatus,
    setConfirmationOpen,
    setIsStatusChangeConfirmOpen,
    setOpenChat,
    setSelectedOrder,
  };
}
