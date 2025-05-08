import { useState } from 'react';

import FlagIcon from '@mui/icons-material/Flag';
import FilterListIcon from '@mui/icons-material/FilterList';
import AssignmentIcon from '@mui/icons-material/Assignment';
import {
  Box,
  Menu,
  Stack,
  Divider,
  Checkbox,
  FormGroup,
  IconButton,
  Typography,
  FormControlLabel,
} from '@mui/material';

import { TaskStatus, TaskPriority } from 'src/types/enums';

export default function TaskFilterMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusToggle = (value: number) => {
    // lógica de selección para status
  };

  const handlePriorityToggle = (value: number) => {
    // lógica de selección para prioridad
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <FilterListIcon />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Box sx={{ px: 2, py: 2 }}>
          <Stack direction="row" spacing={4}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <AssignmentIcon fontSize="small" color="action" />
                <Typography variant="subtitle2">Estado</Typography>
              </Stack>
              <FormGroup>
                {Object.entries(TaskStatus)
                  .filter(([k]) => Number.isNaN(Number(k)))
                  .map(([label, value]) => (
                    <FormControlLabel
                      key={value}
                      label={label.replace('_', ' ')}
                      control={
                        <Checkbox
                          checked={false}
                          onChange={() => handleStatusToggle(value as number)}
                        />
                      }
                    />
                  ))}
              </FormGroup>
            </Box>

            <Divider orientation="vertical" flexItem />

            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <FlagIcon fontSize="small" color="action" />
                <Typography variant="subtitle2">Prioridad</Typography>
              </Stack>
              <FormGroup>
                {Object.entries(TaskPriority)
                  .filter(([k]) => Number.isNaN(Number(k)))
                  .map(([label, value]) => (
                    <FormControlLabel
                      key={value}
                      control={
                        <Checkbox
                          checked={false}
                          onChange={() => handlePriorityToggle(value as number)}
                        />
                      }
                      label={label}
                    />
                  ))}
              </FormGroup>
            </Box>
          </Stack>
        </Box>
      </Menu>
    </>
  );
}
