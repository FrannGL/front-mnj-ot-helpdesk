import { useState, useEffect } from 'react';

import { Clear, Search, ArrowForward } from '@mui/icons-material';
import { Box, useTheme, TextField, IconButton, InputAdornment } from '@mui/material';

import { varAlpha } from 'src/shared/theme/styles';

import type { OrderFilters } from '../types';

type OrderSearchBarProps = {
  filters: OrderFilters;
  onFiltersChange: (filters: OrderFilters) => void;
};

const OrderSearchBar = ({ filters, onFiltersChange }: OrderSearchBarProps) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');

  useEffect(() => {
    setSearchTerm(filters.searchTerm || '');
  }, [filters.searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    onFiltersChange({ ...filters, searchTerm });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onFiltersChange({ ...filters, searchTerm: '' });
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <TextField
      size="small"
      placeholder="Buscar tareas..."
      variant="outlined"
      fullWidth
      value={searchTerm}
      onChange={handleSearchChange}
      onKeyDown={handleKeyPress}
      sx={{
        '& .MuiOutlinedInput-root': {
          border: 'none',
          outline: 'none',
          backgroundColor: () => varAlpha(theme.vars.palette.grey['500Channel'], 0.1),
          color:
            theme.palette.mode === 'dark'
              ? theme.palette.primary.light
              : theme.palette.primary.darker,
          '& fieldset': {
            border: 'none',
          },
          '&:hover fieldset': {
            border: 'none',
          },
          '&.Mui-focused fieldset': {
            border: 'none',
          },
        },
        pr: { sm: 1 },
        borderRadius: { sm: 1.5 },
        cursor: { sm: 'pointer' },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search fontSize="small" onClick={handleSearchSubmit} sx={{ cursor: 'pointer' }} />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <Box display="flex" alignItems="center" gap={0.5}>
              {searchTerm && (
                <>
                  <IconButton
                    size="small"
                    onClick={handleSearchSubmit}
                    sx={{
                      p: 0.5,
                      color: 'text.primary',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <ArrowForward fontSize="small" />
                  </IconButton>
                  <Clear
                    fontSize="small"
                    sx={{
                      cursor: 'pointer',
                      color: 'text.secondary',
                    }}
                    onClick={handleClearSearch}
                  />
                </>
              )}
            </Box>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default OrderSearchBar;
