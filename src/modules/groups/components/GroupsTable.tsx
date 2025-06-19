import {
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from '@mui/material';

import type { Group } from '../interfaces/group.interface';

interface GroupsTableProps {
  data: Group[] | undefined;
}

export const GroupsTable = ({ data }: GroupsTableProps) => {
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
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name.toUpperCase()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
