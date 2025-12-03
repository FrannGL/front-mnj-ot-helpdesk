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

import type { Sector } from '../interfaces/sector.interface';

interface SectoresTableProps {
  data: Sector[];
  totalCount: number;
  page: number;
  onPageChange: (newPage: number) => void;
  onEdit: (sector: Sector) => void;
  onDelete: (id: number) => void;
}

const ITEMS_PER_PAGE = 10;

export const SectoresTable = ({
  data,
  totalCount,
  page,
  onPageChange,
  onEdit,
  onDelete,
}: SectoresTableProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);

  if (!data || data.length === 0) {
    return (
      <Typography align="center" sx={{ p: 2 }}>
        No hay sectores disponibles.
      </Typography>
    );
  }

  const countPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, sector: Sector) => {
    setAnchorEl(event.currentTarget);
    setSelectedSector(sector);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedSector(null);
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
        <MenuItem onClick={() => handleAction(() => onEdit(selectedSector!))}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Editar
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleAction(() => onDelete(selectedSector!.id))}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Eliminar
        </MenuItem>
      </Menu>
    </>
  );
};
