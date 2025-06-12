'use client';

import type { User } from 'src/modules/users/interfaces';

import { m } from 'framer-motion';

import { GridSearchIcon } from '@mui/x-data-grid';
import {
  Box,
  Menu,
  Stack,
  Button,
  Tooltip,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';
import {
  Tag,
  Info,
  Clear,
  Person as AssigneeIcon,
  Assignment as StatusIcon,
  PriorityHigh as PriorityIcon,
  SupportAgent,
} from '@mui/icons-material';

import { useTags } from 'src/modules/tags/hooks/useTags';
import { useUsers } from 'src/modules/users/hooks/useUsers';

import { statusColorMap } from '../utils';
import { OrderStatusEnum, OrderPriorityEnum } from '../enums';
import { useFilterHandlers } from '../hooks/useFilterHandlers';

import type { OrderFilters } from '../types';

type OrdersFilterProps = {
  filters: OrderFilters;
  onFiltersChange: (filters: OrderFilters) => void;
  hasActiveFilters?: boolean;
};

export function OrdersFilter({ filters, onFiltersChange, hasActiveFilters }: OrdersFilterProps) {
  const { data: users } = useUsers();
  const { data: availableTags } = useTags();

  const {
    anchorStatus,
    anchorPriority,
    anchorAssignedTo,
    anchorClient,
    anchorTags,
    setAnchorStatus,
    setAnchorPriority,
    setAnchorAssignedTo,
    setAnchorClient,
    setAnchorTags,
    getStatusButtonText,
    getPriorityButtonText,
  } = useFilterHandlers();

  const handleResetAllFilters = () => {
    onFiltersChange({
      cliente: undefined,
      status: undefined,
      priority: undefined,
      assignedTo: undefined,
      searchTerm: '',
      tags: undefined,
    });
  };

  return (
    <Box sx={{ width: '100%', mb: 2, display: 'flex', justifyContent: 'space-between' }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <div>
          <Button
            onClick={(e) => setAnchorStatus(e.currentTarget)}
            variant="soft"
            color={filters.status !== undefined ? 'secondary' : 'inherit'}
            startIcon={<StatusIcon fontSize="small" />}
          >
            {getStatusButtonText(filters.status as OrderStatusEnum)}
          </Button>
          <Menu
            anchorEl={anchorStatus}
            open={Boolean(anchorStatus)}
            onClose={() => setAnchorStatus(null)}
          >
            <MenuItem
              onClick={() => {
                onFiltersChange({ ...filters, status: undefined });
                setAnchorStatus(null);
              }}
              selected={!filters.status}
            >
              Todos
            </MenuItem>
            {Object.entries(OrderStatusEnum)
              .filter(([key]) => Number.isNaN(Number(key)))
              .map(([key, value]) => {
                const color = statusColorMap[value as OrderStatusEnum];
                return (
                  <MenuItem
                    key={value}
                    selected={filters.status === value}
                    onClick={() => {
                      onFiltersChange({ ...filters, status: value as number });
                      setAnchorStatus(null);
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box position="relative" width={16} height={16} flexShrink={0}>
                        <Box
                          component={m.div}
                          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0.1, 0.4] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'circIn' }}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: color,
                            transform: 'translate(-50%, -50%)',
                            filter: 'blur(4px)',
                            zIndex: 0,
                          }}
                        />
                        <Box
                          component={m.div}
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '100%',
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor: color,
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1,
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ pl: 2 }}>
                        {key}
                      </Typography>
                    </Box>
                  </MenuItem>
                );
              })}
          </Menu>
        </div>

        <div>
          <Button
            onClick={(e) => setAnchorPriority(e.currentTarget)}
            variant="soft"
            color={filters.priority !== undefined ? 'secondary' : 'inherit'}
            startIcon={<PriorityIcon fontSize="small" />}
          >
            {getPriorityButtonText(filters.priority as OrderPriorityEnum)}
          </Button>
          <Menu
            anchorEl={anchorPriority}
            open={Boolean(anchorPriority)}
            onClose={() => setAnchorPriority(null)}
          >
            <MenuItem
              onClick={() => {
                onFiltersChange({ ...filters, priority: undefined });
                setAnchorPriority(null);
              }}
              selected={!filters.priority}
            >
              Todas
            </MenuItem>
            {Object.entries(OrderPriorityEnum)
              .filter(([key]) => Number.isNaN(Number(key)))
              .map(([key, value]) => (
                <MenuItem
                  key={value}
                  selected={filters.priority === value}
                  onClick={() => {
                    onFiltersChange({ ...filters, priority: value as number });
                    setAnchorPriority(null);
                  }}
                >
                  <Typography variant="body2">{key}</Typography>
                </MenuItem>
              ))}
          </Menu>
        </div>

        <div>
          <Button
            onClick={(e) => setAnchorClient(e.currentTarget)}
            variant="soft"
            color={filters.cliente !== undefined ? 'secondary' : 'inherit'}
            startIcon={<AssigneeIcon fontSize="small" />}
          >
            {users?.results.find((agent: User) => agent.id === filters.cliente)?.username ||
              'Generado por'}
          </Button>
          <Menu
            anchorEl={anchorClient}
            open={Boolean(anchorClient)}
            onClose={() => setAnchorClient(null)}
          >
            <MenuItem
              onClick={() => {
                onFiltersChange({ ...filters, cliente: undefined });
                setAnchorClient(null);
              }}
              selected={!filters.cliente}
            >
              Todos
            </MenuItem>
            {users?.results.map((agent: User) => (
              <MenuItem
                key={agent.id}
                selected={filters.cliente === agent.id}
                onClick={() => {
                  onFiltersChange({ ...filters, cliente: agent.id });
                  setAnchorClient(null);
                }}
              >
                {agent.username}
              </MenuItem>
            ))}
          </Menu>
        </div>

        <div>
          <Button
            onClick={(e) => setAnchorTags(e.currentTarget)}
            variant="soft"
            color={filters.tags?.length ? 'secondary' : 'inherit'}
            startIcon={<Tag fontSize="small" />}
          >
            {filters.tags?.length
              ? availableTags
                  ?.filter((tag) => filters.tags?.includes(tag.id))
                  .map((tag) => tag.nombre)
                  .join(', ') || 'Tags seleccionados'
              : 'Tags'}
          </Button>
          <Menu
            anchorEl={anchorTags}
            open={Boolean(anchorTags)}
            onClose={() => setAnchorTags(null)}
            PaperProps={{ style: { maxHeight: 300, width: 250 } }}
          >
            <MenuItem
              onClick={() => {
                onFiltersChange({ ...filters, tags: undefined });
                setAnchorTags(null);
              }}
              selected={!filters.tags?.length}
            >
              Todos los tags
            </MenuItem>
            {availableTags?.map((tag) => (
              <MenuItem
                key={tag.id}
                selected={filters.tags?.includes(tag.id)}
                onClick={() => {
                  const currentTags = filters.tags || [];
                  const newTags = currentTags.includes(tag.id)
                    ? currentTags.filter((t) => t !== tag.id)
                    : [...currentTags, tag.id];

                  onFiltersChange({
                    ...filters,
                    tags: newTags.length ? newTags : undefined,
                  });
                }}
              >
                {tag.nombre}
              </MenuItem>
            ))}
          </Menu>
        </div>

        <div>
          <Button
            onClick={(e) => setAnchorAssignedTo(e.currentTarget)}
            variant="soft"
            color={filters.assignedTo !== undefined ? 'secondary' : 'inherit'}
            startIcon={<SupportAgent fontSize="small" />}
          >
            {users?.results.find((agent: User) => agent.id === filters.assignedTo)?.username ||
              'Asignado a'}
          </Button>
          <Menu
            anchorEl={anchorAssignedTo}
            open={Boolean(anchorAssignedTo)}
            onClose={() => setAnchorAssignedTo(null)}
          >
            <MenuItem
              onClick={() => {
                onFiltersChange({ ...filters, assignedTo: undefined });
                setAnchorAssignedTo(null);
              }}
              selected={!filters.assignedTo}
            >
              Todos
            </MenuItem>
            {users?.results.map((agent: User) => (
              <MenuItem
                key={agent.id}
                selected={filters.assignedTo === agent.id}
                onClick={() => {
                  onFiltersChange({ ...filters, assignedTo: agent.id });
                  setAnchorAssignedTo(null);
                }}
              >
                {agent.username}
              </MenuItem>
            ))}
          </Menu>
        </div>

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

        {hasActiveFilters && (
          <Button onClick={handleResetAllFilters} color="error">
            Limpiar Filtros
          </Button>
        )}
      </Stack>
    </Box>
  );
}
