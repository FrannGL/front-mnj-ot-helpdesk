'use client';

import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Box, Stack, Typography, CircularProgress } from '@mui/material';

import { useUsers } from 'src/modules/users/hooks/useUsers';
import { isSuperAdmin } from 'src/shared/utils/verifyUserRole';
import { ConfirmationModal } from 'src/shared/components/custom';
import CreateButton from 'src/modules/orders/components/CreateButton';

import { Filters } from './Filters';
import { UserModal } from './UserModal';
import { UsersTable } from './UsersTable';
import { useUsersMutations } from '../hooks/useUsersMutations';

import type { UserGroups } from '../enums';
import type { User, ServerResponse } from '../interfaces';

interface AdminUserProps {
  initialData?: ServerResponse;
}

export function AdminUser({ initialData }: AdminUserProps) {
  const [page, setPage] = useState(1);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedClerkId, setSelectedClerkId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { user } = useUser();
  const publicMetadata = (user?.publicMetadata ?? {}) as { role?: string };
  const queryClient = useQueryClient();

  const canManageUsers = isSuperAdmin(publicMetadata);

  const { data, isLoading } = useUsers(page, {
    initialData: page === 1 ? initialData : undefined,
  });

  const { deleteClerkMutation, toggleStatusMutation } = useUsersMutations();

  const [filters, setFilters] = useState({
    group: '' as unknown as UserGroups | '',
    searchTerm: '',
  });

  const rowsPerPage = 10;

  const handleEdit = (u: User) => {
    if (!canManageUsers) return;
    setSelectedUser(u);
    setEditModalOpen(true);
  };

  const handleDelete = (userToDelete: User) => {
    if (!canManageUsers) return;
    setSelectedClerkId(userToDelete.clerk_id);
    setConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!canManageUsers) return;

    if (selectedClerkId) {
      deleteClerkMutation.mutate(selectedClerkId, {
        onSuccess: () => {
          toast.success('Usuario eliminado exitosamente');
          setConfirmationOpen(false);
          setSelectedClerkId(null);
        },
        onError: (error) => {
          toast.error('Error al eliminar usuario');
          console.error('Error deleting user:', error);
        },
      });
    }
  };

  const handleToggleStatus = (clerkId: string, isActive: boolean) => {
    if (!canManageUsers) return;

    toggleStatusMutation.mutate(
      { clerkId, isActive: !isActive },
      {
        onSuccess: () => {
          toast.success(`Usuario ${!isActive ? 'activado' : 'desactivado'} exitosamente`);
        },
        onError: (error) => {
          toast.error('Error al cambiar estado del usuario');
          console.error('Error toggling user status:', error);
        },
      }
    );
  };

  const handlePageChange = (_: unknown, value: number) => setPage(value);

  const handleUserCreated = () => {
    queryClient.refetchQueries({ queryKey: ['users'] });
  };

  const filteredUsers = useMemo(() => {
    if (!data?.results) return [];

    return data.results.filter((u) => {
      const matchesGroup = !filters.group || u.groups.some((group) => group.id === filters.group);

      const matchesSearch =
        !filters.searchTerm ||
        u.username.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (u.email?.toLowerCase() || '').includes(filters.searchTerm.toLowerCase());

      return matchesGroup && matchesSearch;
    });
  }, [data?.results, filters]);

  const totalPages = Math.ceil((data?.count ?? 0) / rowsPerPage);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data?.results.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <Typography>No hay usuarios disponibles</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2} sx={{ px: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Administrar Usuarios
      </Typography>
      <Filters filters={filters} setFilters={setFilters} />
      <UsersTable
        users={filteredUsers}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onEdit={canManageUsers ? handleEdit : undefined}
        onDelete={canManageUsers ? handleDelete : undefined}
        onToggleStatus={canManageUsers ? handleToggleStatus : undefined}
        disableActions={!canManageUsers}
      />
      {canManageUsers && <CreateButton type="user" onUserCreated={handleUserCreated} />}
      <UserModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        type="edit"
        userId={selectedUser?.id}
        clerkId={selectedUser?.clerk_id}
        disabled={!canManageUsers}
        defaultValues={{
          username: selectedUser?.username,
          email: selectedUser?.email,
          firstName: selectedUser?.firstName,
          lastName: selectedUser?.lastName,
          groups: selectedUser?.groups?.map((group) => group.id),
        }}
      />
      <ConfirmationModal
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar eliminación"
        content="¿Estás seguro de que deseas eliminar este usuario?"
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </Stack>
  );
}
