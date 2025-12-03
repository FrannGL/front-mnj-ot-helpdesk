import React, { useState } from 'react';

import { MoreVert } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Menu,
  Table,
  Paper,
  Divider,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Typography,
  Pagination,
  TableContainer,
} from '@mui/material';

import type { Edificio } from '../interfaces/edificio.interface';

interface EdificiosTableProps {
  data: Edificio[];
  totalCount: number;
  page: number;
  onPageChange: (newPage: number) => void;
  onEdit: (edificio: Edificio) => void;
  onDelete: (id: number) => void;
}

const ITEMS_PER_PAGE = 10;

export const EdificiosTable = ({
  data,
  totalCount,
  page,
  onPageChange,
  onEdit,
  onDelete,
}: EdificiosTableProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEdificio, setSelectedEdificio] = useState<Edificio | null>(null);

  if (!data || data.length === 0) {
    return (
      <Typography align="center" sx={{ p: 2 }}>
        No hay edificios disponibles.
      </Typography>
    );
  }

  const countPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, edificio: Edificio) => {
    setAnchorEl(event.currentTarget);
    setSelectedEdificio(edificio);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedEdificio(null);
  };

  const handleAction = (action: () => void) => {
    action();
    handleCloseMenu();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nombre}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleOpenMenu(e, item)}>
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination count={countPages} page={page} onChange={handleChangePage} color="primary" />
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={() => handleAction(() => onEdit(selectedEdificio!))}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Editar
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleAction(() => onDelete(selectedEdificio!.id))}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Eliminar
        </MenuItem>
      </Menu>
    </>
  );
};
