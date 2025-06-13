'use client';

import type { User } from 'src/modules/users/interfaces';
import type { OrderFilters } from 'src/modules/orders/types';

import { m } from 'framer-motion';

import { Box, Stack, Button, Typography } from '@mui/material';
import {
  Tag,
  SupportAgent,
  Person as AssigneeIcon,
  Assignment as StatusIcon,
  PriorityHigh as PriorityIcon,
} from '@mui/icons-material';

import { useTags } from 'src/modules/tags/hooks/useTags';
import { statusColorMap } from 'src/modules/orders/utils';
import { useUsers } from 'src/modules/users/hooks/useUsers';
import { useFilterHandlers } from 'src/modules/orders/hooks';
import { OrderStatusEnum, OrderPriorityEnum } from 'src/modules/orders/enums';

import FilterButton from './FilterButton';
import DesktopSearchBar from './DesktopSearchBar';

type DesktopFilterMenuProps = {
  filters: OrderFilters;
  onFiltersChange: (filters: OrderFilters) => void;
  hasActiveFilters?: boolean;
};

const DesktopFilterMenu = ({
  filters,
  onFiltersChange,
  hasActiveFilters,
}: DesktopFilterMenuProps) => {
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

  const renderStatusOption = (option: { id: string | number; label: string }) => {
    const color = statusColorMap[option.id as OrderStatusEnum];
    return (
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
          {option.label}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%', mb: 2, display: 'flex', justifyContent: 'space-between' }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <FilterButton
          label="Estado"
          icon={<StatusIcon fontSize="small" />}
          options={Object.entries(OrderStatusEnum)
            .filter(([key]) => Number.isNaN(Number(key)))
            .map(([key, value]) => ({
              id: value,
              label: key,
            }))}
          selectedValue={filters.status}
          onSelect={(value) => onFiltersChange({ ...filters, status: value as number })}
          anchorEl={anchorStatus}
          onOpen={(e) => setAnchorStatus(e.currentTarget)}
          onClose={() => setAnchorStatus(null)}
          customOptionRender={renderStatusOption}
        />

        <FilterButton
          label="Prioridad"
          icon={<PriorityIcon fontSize="small" />}
          options={Object.entries(OrderPriorityEnum)
            .filter(([key]) => Number.isNaN(Number(key)))
            .map(([key, value]) => ({
              id: value,
              label: key,
            }))}
          selectedValue={filters.priority}
          onSelect={(value) => onFiltersChange({ ...filters, priority: value as number })}
          anchorEl={anchorPriority}
          onOpen={(e) => setAnchorPriority(e.currentTarget)}
          onClose={() => setAnchorPriority(null)}
        />

        <FilterButton
          label="Generado por"
          icon={<AssigneeIcon fontSize="small" />}
          options={
            users?.results.map((agent: User) => ({
              id: agent.id,
              label: agent.username,
            })) || []
          }
          selectedValue={filters.cliente}
          onSelect={(value) => onFiltersChange({ ...filters, cliente: value as number })}
          anchorEl={anchorClient}
          onOpen={(e) => setAnchorClient(e.currentTarget)}
          onClose={() => setAnchorClient(null)}
        />

        <FilterButton
          label="Tags"
          icon={<Tag fontSize="small" />}
          options={
            availableTags?.map((tag) => ({
              id: tag.id,
              label: tag.nombre,
            })) || []
          }
          selectedValue={filters.tags}
          onSelect={(value) => onFiltersChange({ ...filters, tags: value as number[] })}
          anchorEl={anchorTags}
          onOpen={(e) => setAnchorTags(e.currentTarget)}
          onClose={() => setAnchorTags(null)}
          multiple
        />

        <FilterButton
          label="Asignado a"
          icon={<SupportAgent fontSize="small" />}
          options={
            users?.results.map((agent: User) => ({
              id: agent.id,
              label: agent.username,
            })) || []
          }
          selectedValue={filters.assignedTo}
          onSelect={(value) => onFiltersChange({ ...filters, assignedTo: value as number })}
          anchorEl={anchorAssignedTo}
          onOpen={(e) => setAnchorAssignedTo(e.currentTarget)}
          onClose={() => setAnchorAssignedTo(null)}
        />

        <DesktopSearchBar filters={filters} onFiltersChange={onFiltersChange} />

        {hasActiveFilters && (
          <Button onClick={handleResetAllFilters} color="error">
            Limpiar Filtros
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default DesktopFilterMenu;
