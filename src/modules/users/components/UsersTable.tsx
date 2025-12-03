'use client';

import { Edit, Delete, Person } from '@mui/icons-material';
import {
  Box,
  Chip,
  Stack,
  Paper,
  Table,
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
  onDelete?: (userId: number) => void;
  disableActions?: boolean;
}

export function UsersTable({
  users,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  disableActions,
}: UsersTableProps) {
  const theme = useTheme();

  return (
    <>
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
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  {user.email || <Typography variant="caption">Sin email</Typography>}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {user.groups.length ? (
                      user.groups.map((group) => (
                        <Chip
                          key={group.id}
                          label={group.name}
                          size="small"
                          variant="soft"
                          color="primary"
                          icon={<Person />}
                        />
                      ))
                    ) : (
                      <Typography variant="caption">Sin roles</Typography>
                    )}
                  </Stack>
                </TableCell>
                <TableCell>
                  {onEdit || onDelete ? (
                    <Stack direction="row" spacing={0.5}>
                      {onEdit && (
                        <IconButton
                          onClick={() => onEdit(user)}
                          size="small"
                          color="primary"
                          disabled={disableActions}
                        >
                          <Edit />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton
                          onClick={() => onDelete(user.id)}
                          size="small"
                          color="error"
                          disabled={disableActions}
                        >
                          <Delete />
                        </IconButton>
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
