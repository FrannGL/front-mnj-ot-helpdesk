import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Table,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Typography,
  TableContainer,
} from '@mui/material';

import type { Tag } from '../interfaces/tag.interface';

interface TagsTableProps {
  data: Tag[] | undefined;
  onEdit: (tag: Tag) => void;
  onDelete: (id: number) => void;
}

export const TagsTable = ({ data, onEdit, onDelete }: TagsTableProps) => {
  if (!data || data.length === 0) {
    return (
      <Typography align="center" sx={{ p: 2 }}>
        No hay tags disponibles.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.nombre}</TableCell>
              <TableCell>
                {Array.isArray(item.tags) && item.tags.length > 0
                  ? item.tags.join(', ')
                  : 'Sin tags'}
              </TableCell>
              <TableCell align="center">
                <IconButton onClick={() => onDelete(item.id)} color="error" aria-label="eliminar">
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={() => onEdit(item)} color="primary" aria-label="editar">
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
