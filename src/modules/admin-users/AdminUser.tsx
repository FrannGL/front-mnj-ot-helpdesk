'use client';

import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { Fira_Sans } from 'next/font/google';

import { GridSearchIcon } from '@mui/x-data-grid';
import { Edit, Info, Group, Clear, Delete, Person } from '@mui/icons-material';
import {
  Box,
  Chip,
  Table,
  Paper,
  Stack,
  Select,
  Tooltip,
  TableRow,
  useTheme,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  InputLabel,
  Pagination,
  IconButton,
  Typography,
  FormControl,
  TableContainer,
  InputAdornment,
  CircularProgress,
} from '@mui/material';

import { useUsers } from 'src/modules/users/hooks/useUsers';

import { CreateButton } from 'src/components/CreateButton';
import { ConfirmationModal } from 'src/components/ConfirmationModal';

import { UserGroups } from '../users/enums';
import { UserModal } from '../users/components/UserModal';

import type { User } from '../users/interfaces';

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
});

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

  const theme = useTheme();

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
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

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const filteredUsers = useMemo(() => {
    if (!data?.results) return [];

    return data.results.filter((user) => {
      const matchesGroup = !filters.group || user.groups.some((group) => group === filters.group);
      const matchesSearch =
        !filters.searchTerm ||
        user.username.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(filters.searchTerm.toLowerCase());

      return matchesGroup && matchesSearch;
    });
  }, [data?.results, filters]);

  const paginatedUsers = filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const uniqueGroups = useMemo(() => {
    if (!data?.results) return [];
    const groups = Array.from(new Set(data.results.flatMap((user) => user.groups)));
    return groups.filter((group) => Object.values(UserGroups).includes(group));
  }, [data?.results]);

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
    <Stack sx={{ px: 3 }} spacing={1}>
      <Typography
        variant="h4"
        sx={{ fontFamily: `${firaSans.style.fontFamily} !important`, lineHeight: 1.3, pl: 1 }}
        gutterBottom
      >
        Administrar Usuarios
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por Grupo</InputLabel>
          <Select
            value={filters.group}
            label="Filtrar por Grupo"
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                group: e.target.value as UserGroups | '',
              }))
            }
            startAdornment={
              <InputAdornment position="start">
                <Group />
              </InputAdornment>
            }
          >
            <MenuItem value="">Todos</MenuItem>
            {uniqueGroups.map((group) => (
              <MenuItem key={group} value={group}>
                {group}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          variant="standard"
          size="small"
          value={filters.searchTerm}
          placeholder="Buscar"
          onChange={(e) => setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))}
          sx={{
            mt: 1.2,
            width: 250,
            '& .MuiInput-underline:after': {
              borderBottomColor: 'primary.light',
            },
            '& .MuiInputBase-input:focus': {
              color: 'primary.light',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <GridSearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Box display="flex" alignItems="center" gap={0.5}>
                  {filters.searchTerm && (
                    <Clear
                      fontSize="small"
                      sx={{ cursor: 'pointer', color: 'text.secondary' }}
                      onClick={() => setFilters({ searchTerm: '', group: '' })}
                    />
                  )}
                  <Tooltip title="Buscar por título, agente, estado o prioridad">
                    <Info fontSize="small" sx={{ color: 'text.secondary' }} />
                  </Tooltip>
                </Box>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  '&:hover': {
                    bgcolor: theme.palette.action.hover,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  },
                }}
              >
                <TableCell
                  sx={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.username}
                </TableCell>
                <TableCell
                  sx={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.email || (
                    <Typography variant="caption" color="text.secondary">
                      Sin email registrado
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {user.groups.length > 0 ? (
                    <Stack direction="row" flexWrap="wrap" spacing={0.5}>
                      {user.groups.map((group) => (
                        <Chip
                          key={group}
                          label={group}
                          size="small"
                          variant="soft"
                          color="primary"
                          icon={<Person />}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      No tiene roles asignados
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEdit(user)}
                    color={theme.palette.mode === 'dark' ? 'inherit' : 'primary'}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)} color="error" size="small">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>

      <CreateButton type="user" />

      <UserModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
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
