'use client';

import { Block, Delete, Person, Person as AvatarIcon } from '@mui/icons-material';
import {
  Box,
  Chip,
  Stack,
  Paper,
  Table,
  Avatar,
  Tooltip,
  TableRow,
  useTheme,
  TableHead,
  TableBody,
  TableCell,
  IconButton,
  Pagination,
  Typography,
  TableContainer,
} from '@mui/material';

import type { User } from '../interfaces';

interface UsersTableProps {
  users: User[];
  page: number;
  totalPages: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onToggleStatus?: (clerkId: string, isActive: boolean) => void;
  disableActions?: boolean;
}

export function UsersTable({
  users,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  onToggleStatus,
  disableActions,
}: UsersTableProps) {
  const theme = useTheme();

  const formatFullName = (user: User) => {
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return user.username;
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Nombre Completo</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
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
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar src={user.imageUrl} alt={user.username} sx={{ width: 32, height: 32 }}>
                      <AvatarIcon />
                    </Avatar>
                    <Typography variant="body2" fontWeight="medium">
                      {user.username}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{formatFullName(user) || 'Sin nombre'}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {user.email || <Typography variant="caption">Sin email</Typography>}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.isActive !== false ? 'Activo' : 'Inactivo'}
                    size="small"
                    color={user.isActive !== false ? 'success' : 'error'}
                    variant="outlined"
                  />
                </TableCell>

                <TableCell>
                  {onEdit || onDelete || onToggleStatus ? (
                    <Stack direction="row" spacing={0.5}>
                      {/* {onEdit && (
                        <Tooltip title="Editar usuario">
                          <IconButton
                            onClick={() => onEdit(user)}
                            size="small"
                            color="primary"
                            disabled={disableActions}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      )} */}
                      {onToggleStatus && (
                        <Tooltip title={user.isActive !== false ? 'Desactivar' : 'Activar'}>
                          <IconButton
                            onClick={() => onToggleStatus(user.clerk_id, user.isActive !== false)}
                            size="small"
                            color={user.isActive !== false ? 'warning' : 'success'}
                            disabled={disableActions}
                          >
                            {user.isActive !== false ? <Block /> : <Person />}
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDelete && (
                        <Tooltip title="Eliminar usuario">
                          <IconButton
                            onClick={() => onDelete(user)}
                            size="small"
                            color="error"
                            disabled={disableActions}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  ) : null}
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
          onChange={onPageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </>
  );
}
