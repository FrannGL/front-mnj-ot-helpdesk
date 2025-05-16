'use client';

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
  Clear,
  Info as InfoIcon,
  Person as AssigneeIcon,
  Assignment as StatusIcon,
  PriorityHigh as PriorityIcon,
} from '@mui/icons-material';

import { TaskStatus, TaskPriority } from '../enums';
import { CreateOrderButton } from './CreateOrderButton';
import { statusColorMap } from '../utils/statusColorMap';
import { useFilterHandlers } from '../hooks/useFilterHandlers';

import type { Task } from '../interfaces';

type Props = {
  tasks: Task[];
};

export function FiltersContainer({ tasks }: Props) {
  const {
    filters,
    anchorStatus,
    anchorPriority,
    anchorAssignedTo,
    setAnchorStatus,
    setAnchorPriority,
    setAnchorAssignedTo,
    handleFilterChange,
    handleResetAllFilters,
    hasActiveFilters,
    statusButtonText,
    priorityButtonText,
    assignedButtonText,
    uniqueAgents,
  } = useFilterHandlers(tasks);

  return (
    <Box
      sx={{
        width: '100%',
        mb: 2,
        pl: 2,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
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
              .map(([key, value]) => {
                const color = statusColorMap[value as TaskStatus];

                return (
                  <MenuItem
                    key={value}
                    selected={filters.status === value}
                    onClick={() => {
                      handleFilterChange('status', value as number);
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
                      <Typography
                        variant="subtitle2"
                        sx={{
                          ml: 3,
                        }}
                      >
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

        <div>
          <TextField
            variant="standard"
            size="small"
            value={filters.searchTerm}
            placeholder="Buscar"
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
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
                        onClick={() => handleFilterChange('searchTerm', '')}
                      />
                    )}
                    <Tooltip title="Buscar por título, agente, estado o prioridad">
                      <InfoIcon fontSize="small" sx={{ color: 'text.secondary' }} />
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
      <Stack>
        <CreateOrderButton />
      </Stack>
    </Box>
  );
}
