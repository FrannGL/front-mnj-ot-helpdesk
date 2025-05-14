'use client';

import { useState } from 'react';

import { Box, Menu, Stack, Button, MenuItem } from '@mui/material';
import {
  Person as AssigneeIcon,
  Assignment as StatusIcon,
  PriorityHigh as PriorityIcon,
} from '@mui/icons-material';

import { useFilters, useTaskActions } from 'src/store/useTaskStore';

import { TaskStatus, TaskPriority } from '../enums';

import type { Task } from '../interfaces';

const getEnumKeyByValue = <T extends Record<string, any>>(
  enumObj: T,
  value: number
): keyof T | undefined =>
  Object.keys(enumObj).find((key) => enumObj[key] === value) as keyof T | undefined;

type Props = {
  tasks: Task[];
};

export function FiltersContainer({ tasks }: Props) {
  const [anchorStatus, setAnchorStatus] = useState<null | HTMLElement>(null);
  const [anchorPriority, setAnchorPriority] = useState<null | HTMLElement>(null);
  const [anchorAssignedTo, setAnchorAssignedTo] = useState<null | HTMLElement>(null);

  const filters = useFilters();
  const { setFilters, resetFilters } = useTaskActions();

  const uniqueAgents = Array.from(new Set(tasks.map((t) => t.assignedTo))).sort();

  const handleFilterChange = <K extends keyof typeof filters>(
    key: K,
    value: (typeof filters)[K] | null
  ) => {
    setFilters({ [key]: value } as Partial<typeof filters>);
  };

  const getStatusLabel = (value: number | null) =>
    value ? getEnumKeyByValue(TaskStatus, value) : null;

  const getPriorityLabel = (value: number | null) =>
    value ? getEnumKeyByValue(TaskPriority, value) : null;

  const handleResetAllFilters = () => {
    resetFilters();
    setAnchorStatus(null);
    setAnchorPriority(null);
    setAnchorAssignedTo(null);
  };

  const hasActiveFilters = Boolean(filters.status || filters.priority || filters.assignedTo);
  const statusButtonText = filters.status ? getStatusLabel(filters.status) : 'Estado';
  const priorityButtonText = filters.priority ? getPriorityLabel(filters.priority) : 'Prioridad';
  const assignedButtonText = filters.assignedTo ? filters.assignedTo : 'Asignado a';

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <div>
          <Button
            onClick={(e) => setAnchorStatus(e.currentTarget)}
            variant="soft"
            color="inherit"
            startIcon={<StatusIcon fontSize="small" />}
          >
            {statusButtonText}
          </Button>
          <Menu
            anchorEl={anchorStatus}
            open={Boolean(anchorStatus)}
            onClose={() => setAnchorStatus(null)}
          >
            <MenuItem
              onClick={() => {
                handleFilterChange('status', null);
                setAnchorStatus(null);
              }}
              selected={!filters.status}
            >
              Todos
            </MenuItem>
            {Object.entries(TaskStatus)
              .filter(([key]) => Number.isNaN(Number(key)))
              .map(([key, value]) => (
                <MenuItem
                  key={value}
                  selected={filters.status === value}
                  onClick={() => {
                    handleFilterChange('status', value as number);
                    setAnchorStatus(null);
                  }}
                >
                  {key}
                </MenuItem>
              ))}
          </Menu>
        </div>

        <div>
          <Button
            onClick={(e) => setAnchorPriority(e.currentTarget)}
            variant="soft"
            color="inherit"
            startIcon={<PriorityIcon fontSize="small" />}
          >
            {priorityButtonText}
          </Button>
          <Menu
            anchorEl={anchorPriority}
            open={Boolean(anchorPriority)}
            onClose={() => setAnchorPriority(null)}
          >
            <MenuItem
              onClick={() => {
                handleFilterChange('priority', null);
                setAnchorPriority(null);
              }}
              selected={!filters.priority}
            >
              Todas
            </MenuItem>
            {Object.entries(TaskPriority)
              .filter(([key]) => Number.isNaN(Number(key)))
              .map(([key, value]) => (
                <MenuItem
                  key={value}
                  selected={filters.priority === value}
                  onClick={() => {
                    handleFilterChange('priority', value as number);
                    setAnchorPriority(null);
                  }}
                >
                  {key}
                </MenuItem>
              ))}
          </Menu>
        </div>

        <div>
          <Button
            onClick={(e) => setAnchorAssignedTo(e.currentTarget)}
            variant="soft"
            color="inherit"
            startIcon={<AssigneeIcon fontSize="small" />}
          >
            {assignedButtonText}
          </Button>
          <Menu
            anchorEl={anchorAssignedTo}
            open={Boolean(anchorAssignedTo)}
            onClose={() => setAnchorAssignedTo(null)}
          >
            <MenuItem
              onClick={() => {
                handleFilterChange('assignedTo', null);
                setAnchorAssignedTo(null);
              }}
              selected={!filters.assignedTo}
            >
              Todos
            </MenuItem>
            {uniqueAgents.map((agent) => (
              <MenuItem
                key={agent}
                selected={filters.assignedTo === agent}
                onClick={() => {
                  handleFilterChange('assignedTo', agent);
                  setAnchorAssignedTo(null);
                }}
              >
                {agent}
              </MenuItem>
            ))}
          </Menu>
        </div>

        {hasActiveFilters && (
          <Button
            variant="text"
            size="small"
            color="error"
            onClick={handleResetAllFilters}
            title="Limpiar filtros"
            sx={{
              ml: 1,
              fontSize: 12,
            }}
          >
            Limpiar Filtros
          </Button>
        )}
      </Stack>
    </Box>
  );
}
