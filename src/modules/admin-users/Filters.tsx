'use client';

import { useState } from 'react';

import { GridSearchIcon } from '@mui/x-data-grid';
import { Info, Clear, Group } from '@mui/icons-material';
import {
  Box,
  Menu,
  Button,
  Tooltip,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';

import { UserGroups } from '../users/enums';

interface FiltersType {
  group: UserGroups | '';
  searchTerm: string;
}

interface FiltersProps {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
}

export function Filters({ filters, setFilters }: FiltersProps) {
  const [groupAnchor, setGroupAnchor] = useState<null | HTMLElement>(null);

  return (
    <Box display="flex" gap={2}>
      <div>
        <Button
          onClick={(e) => setGroupAnchor(e.currentTarget)}
          variant="soft"
          color={filters.group ? 'secondary' : 'inherit'}
          startIcon={<Group fontSize="small" />}
        >
          {filters.group ? UserGroups[filters.group] : 'Todos los grupos'}
        </Button>
        <Menu anchorEl={groupAnchor} open={!!groupAnchor} onClose={() => setGroupAnchor(null)}>
          <MenuItem
            onClick={() => {
              setFilters((prev) => ({ ...prev, group: '' }));
              setGroupAnchor(null);
            }}
            selected={!filters.group}
          >
            Todos los grupos
          </MenuItem>
          {Object.entries(UserGroups)
            .filter(([key]) => Number.isNaN(Number(key)))
            .map(([key, value]) => (
              <MenuItem
                key={value}
                selected={filters.group === value}
                onClick={() => {
                  setFilters((prev) => ({ ...prev, group: value as UserGroups }));
                  setGroupAnchor(null);
                }}
              >
                <Typography variant="body2">{key}</Typography>
              </MenuItem>
            ))}
        </Menu>
      </div>

      <TextField
        variant="standard"
        size="small"
        value={filters.searchTerm}
        placeholder="Buscar"
        onChange={(e) => setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))}
        sx={{ width: 250, mt: 1.2 }}
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
                    onClick={() => setFilters({ searchTerm: '', group: '' })}
                  />
                )}
                <Tooltip title="Buscar por nombre o email">
                  <Info fontSize="small" sx={{ color: 'text.secondary' }} />
                </Tooltip>
              </Box>
            </InputAdornment>
          ),
        }}
      />

      {(filters.searchTerm || filters.group) && (
        <Button
          onClick={() => setFilters({ group: '', searchTerm: '' })}
          variant="text"
          color="error"
          sx={{ mt: 0.5 }}
        >
          Limpiar filtros
        </Button>
      )}
    </Box>
  );
}
