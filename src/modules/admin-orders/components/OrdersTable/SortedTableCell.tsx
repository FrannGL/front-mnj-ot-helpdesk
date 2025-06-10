import type { Order } from 'src/modules/orders/interfaces';

import { Stack, TableCell, Typography } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

interface SortableTableCellProps {
  column: keyof Order;
  label: string;
  orderBy: keyof Order | '';
  orderDirection: 'asc' | 'desc';
  onSort: (column: keyof Order) => void;
}

export const SortableTableCell = ({
  column,
  label,
  orderBy,
  orderDirection,
  onSort,
}: SortableTableCellProps) => (
  <TableCell sx={{ cursor: 'pointer' }} onClick={() => onSort(column)}>
    <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={0.5}>
      <Typography variant="subtitle2">{label}</Typography>
      {orderBy === column &&
        (orderDirection === 'asc' ? (
          <ArrowUpward sx={{ fontSize: '15px' }} />
        ) : (
          <ArrowDownward sx={{ fontSize: '15px' }} />
        ))}
    </Stack>
  </TableCell>
);
