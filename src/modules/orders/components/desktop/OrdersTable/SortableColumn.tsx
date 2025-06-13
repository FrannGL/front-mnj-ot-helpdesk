import { TableCell, TableSortLabel } from '@mui/material';

import type { OrderTableColumn } from './OrdersTable';

export interface SortedTableCellProps {
  column: OrderTableColumn;
  orderBy: string | null;
  orderDirection: 'asc' | 'desc';
  onSort: (property: string) => void;
}

export const SortedTableCell = ({
  column,
  orderBy,
  orderDirection,
  onSort,
}: SortedTableCellProps) => (
  <TableCell
    align={column.align || 'left'}
    sortDirection={orderBy === column.id ? orderDirection : false}
    sx={{
      fontWeight: 'bold',
      width: column.width || 'auto',
    }}
  >
    <TableSortLabel
      active={orderBy === column.id}
      direction={orderBy === column.id ? orderDirection : 'asc'}
      onClick={() => onSort(column.id)}
    >
      {column.label}
    </TableSortLabel>
  </TableCell>
);
