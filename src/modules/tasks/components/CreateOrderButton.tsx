import { useState } from 'react';

import Fab from '@mui/material/Fab';
import { Add as AddIcon } from '@mui/icons-material';

import { CreateTaskModal } from './CreateTaskModal';

export function CreateOrderButton() {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Fab
        color="primary"
        aria-label="Crear orden"
        onClick={() => setOpen(true)}
        sx={{
          width: 48,
          height: 48,
          position: 'fixed',
          right: { xs: 24, md: 32 },
          bottom: { xs: 24, md: 32 },
          zIndex: (theme) => theme.zIndex.speedDial,
        }}
      >
        <AddIcon />
      </Fab>

      <CreateTaskModal open={open} onClose={handleClose} />
    </>
  );
}
