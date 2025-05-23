'use client';

import { toast } from 'sonner';
import { useMemo, useState } from 'react';

import { Box, Stack, Typography, CircularProgress } from '@mui/material';

import { useUsers } from 'src/modules/users/hooks/useUsers';
import { CreateButton } from 'src/shared/components/custom/CreateButton';
import { ConfirmationModal } from 'src/shared/components/custom/ConfirmationModal';

import { Filters } from './Filters';
import { UsersTable } from './UsersTable';
import { UserModal } from '../users/components/UserModal';

import type { User } from '../users/interfaces';
import type { UserGroups } from '../users/enums';

export function AdminUser() {
  const { data, isLoading, deleteMutation } = useUsers();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
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
      const matchesGroup = !filters.group || user.groups.includes(filters.group);
      const matchesSearch =
        !filters.searchTerm ||
        user.username.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(filters.searchTerm.toLowerCase());

      return matchesGroup && matchesSearch;
    });
  }, [data?.results, filters]);

  const paginatedUsers = filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

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
        users={paginatedUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
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
          groups: selectedUser?.groups,
        }}
      />

      <ConfirmationModal
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Stack>
  );
}
