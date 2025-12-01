'use client';

import { toast } from 'sonner';
import { useMemo, useState } from 'react';

import { Box, Stack, Typography, CircularProgress } from '@mui/material';

import { useUsers } from 'src/modules/users/hooks/useUsers';
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
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data, isLoading } = useUsers(page, {
    initialData: page === 1 ? initialData : undefined,
  });

  const { deleteMutation } = useUsersMutations();

  const [filters, setFilters] = useState({
    group: '' as unknown as UserGroups | '',
    searchTerm: '',
  });

  const rowsPerPage = 10;

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDelete = (userId: number) => {
    setSelectedUserId(userId);
    setConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUserId) {
      deleteMutation.mutate(selectedUserId, {
        onSuccess: () => {
          toast.success('Usuario eliminado exitosamente');
          setConfirmationOpen(false);
        },
      });
    }
  };

  const handlePageChange = (_: unknown, value: number) => setPage(value);

  const filteredUsers = useMemo(() => {
    if (!data?.results) return [];

    return data.results.filter((user) => {
      const matchesGroup =
        !filters.group || user.groups.some((group) => group.id === filters.group);

      const matchesSearch =
        !filters.searchTerm ||
        user.username.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(filters.searchTerm.toLowerCase());

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
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CreateButton type="user" />

      <UserModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        type="edit"
        userId={selectedUser?.id}
        disabled
        defaultValues={{
          username: selectedUser?.username,
          email: selectedUser?.email,
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
