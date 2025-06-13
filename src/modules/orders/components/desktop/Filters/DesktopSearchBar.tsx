import { Info, Clear } from '@mui/icons-material';
import { GridSearchIcon } from '@mui/x-data-grid';
import { Box, Tooltip, TextField, InputAdornment } from '@mui/material';

import type { OrderFilters } from '../../../types';

type DesktopSearchBarProps = {
  filters: OrderFilters;
  onFiltersChange: (filters: OrderFilters) => void;
};

const DesktopSearchBar = ({ filters, onFiltersChange }: DesktopSearchBarProps) => (
  <TextField
    variant="standard"
    size="small"
    value={filters.searchTerm || ''}
    placeholder="Buscar"
    onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
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
                onClick={() => onFiltersChange({ ...filters, searchTerm: '' })}
              />
            )}
            <Tooltip title="Buscar por título, agente, estado, prioridad o mensajes">
              <Info fontSize="small" sx={{ color: 'text.secondary' }} />
            </Tooltip>
          </Box>
        </InputAdornment>
      ),
    }}
    sx={{
      width: 250,
      '& .MuiInput-underline:after': {
        borderBottomColor: 'primary.light',
      },
      '& .MuiInputBase-input:focus': {
        color: 'primary.light',
      },
    }}
  />
);

export default DesktopSearchBar;
