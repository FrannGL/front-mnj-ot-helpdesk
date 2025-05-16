import { useState } from 'react';
import { m } from 'framer-motion';

import {
  SwapVert,
  PriorityHigh,
  Close as CloseIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import {
  Box,
  Chip,
  Menu,
  Badge,
  Stack,
  Button,
  Divider,
  Checkbox,
  FormGroup,
  IconButton,
  Typography,
  FormControlLabel,
} from '@mui/material';

import { TaskStatus, TaskPriority } from '../enums';
import { statusColorMap } from '../utils/statusColorMap';

interface TaskFilterMenuProps {
  selectedStatuses: number[];
  selectedPriorities: number[];
  onStatusChange: (statuses: number[]) => void;
  onPriorityChange: (priorities: number[]) => void;
  onClear: () => void;
}

export function TaskFilterMenu({
  selectedStatuses,
  selectedPriorities,
  onStatusChange,
  onPriorityChange,
  onClear,
}: TaskFilterMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusToggle = (value: number) => {
    const newStatuses = selectedStatuses.includes(value)
      ? selectedStatuses.filter((v) => v !== value)
      : [...selectedStatuses, value];
    onStatusChange(newStatuses);
  };

  const handlePriorityToggle = (value: number) => {
    const newPriorities = selectedPriorities.includes(value)
      ? selectedPriorities.filter((v) => v !== value)
      : [...selectedPriorities, value];
    onPriorityChange(newPriorities);
  };

  const handleClearFilters = () => {
    onClear();
  };

  const totalSelected = selectedStatuses.length + selectedPriorities.length;

  return (
    <>
      <Badge badgeContent={totalSelected} color="primary" overlap="circular">
        <IconButton
          onClick={handleOpen}
          sx={{
            backgroundColor: open ? 'action.selected' : 'transparent',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <FilterListIcon />
        </IconButton>
      </Badge>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            borderRadius: 2,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            p: 1,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="600">
              Filtros
            </Typography>
            <Stack direction="row" spacing={1}>
              {totalSelected > 0 && (
                <Button
                  size="small"
                  color="warning"
                  onClick={handleClearFilters}
                  sx={{ textTransform: 'none' }}
                >
                  Limpiar
                </Button>
              )}
              <IconButton size="small" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={3} divider={<Divider orientation="vertical" flexItem />}>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <SwapVert
                  fontSize="small"
                  color="action"
                  // sx={{ color: theme.palette.mode === 'dark' ? 'info.dark' : 'primary.main' }}
                />
                <Typography variant="subtitle1" fontWeight="500">
                  Estado
                </Typography>
                {selectedStatuses.length > 0 && (
                  <Chip
                    label={selectedStatuses.length}
                    size="small"
                    color="primary"
                    sx={{ pt: 0.3 }}
                  />
                )}
              </Stack>
              <FormGroup sx={{ gap: 1 }}>
                {Object.entries(TaskStatus)
                  .filter(([k]) => Number.isNaN(Number(k)))
                  .map(([label, value]) => {
                    const color = statusColorMap[value as TaskStatus];

                    return (
                      <FormControlLabel
                        key={value}
                        label={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box position="relative" width={12} height={12} flexShrink={0}>
                              <Box
                                component={m.div}
                                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0.1, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'circIn' }}
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: '50%',
                                  width: 12,
                                  height: 12,
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
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: color,
                                  transform: 'translate(-50%, -50%)',
                                  zIndex: 1,
                                }}
                              />
                            </Box>
                            <Typography variant="body2">{label.replace('_', ' ')}</Typography>
                          </Box>
                        }
                        control={
                          <Checkbox
                            checked={selectedStatuses.includes(value as number)}
                            onChange={() => handleStatusToggle(value as number)}
                            size="small"
                            color="primary"
                          />
                        }
                      />
                    );
                  })}
              </FormGroup>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <PriorityHigh
                  fontSize="small"
                  // sx={{ color: theme.palette.mode === 'dark' ? 'info.dark' : 'primary.main' }}
                  color="action"
                />
                <Typography variant="subtitle1" fontWeight="500">
                  Prioridad
                </Typography>
                {selectedPriorities.length > 0 && (
                  <Chip
                    label={selectedPriorities.length}
                    size="small"
                    color="primary"
                    sx={{ pt: 0.3 }}
                  />
                )}
              </Stack>
              <FormGroup sx={{ gap: 1 }}>
                {Object.entries(TaskPriority)
                  .filter(([k]) => Number.isNaN(Number(k)))
                  .map(([label, value]) => (
                    <FormControlLabel
                      key={value}
                      control={
                        <Checkbox
                          checked={selectedPriorities.includes(value as number)}
                          onChange={() => handlePriorityToggle(value as number)}
                          size="small"
                          color="primary"
                        />
                      }
                      label={<Typography variant="body2">{label}</Typography>}
                      sx={{
                        m: 0,
                        '&:hover': { backgroundColor: 'action.hover', borderRadius: 1 },
                      }}
                    />
                  ))}
              </FormGroup>
            </Box>
          </Stack>

          {totalSelected > 0 && (
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleClose}
                sx={{
                  textTransform: 'none',
                  fontWeight: '500',
                  py: 1,
                }}
              >
                Aplicar filtros ({totalSelected})
              </Button>
            </Box>
          )}
        </Box>
      </Menu>
    </>
  );
}
