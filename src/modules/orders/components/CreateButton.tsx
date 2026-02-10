import { useState } from 'react';
import dynamic from 'next/dynamic';

import Fab from '@mui/material/Fab';
import { Add as AddIcon } from '@mui/icons-material';

import { UserModal } from '../../users/components/UserModal';

const OrderForm = dynamic(() => import('./OrderForm'), {
  loading: () => null,
  ssr: false,
});

type ModalType = 'order' | 'user';

interface Props {
  type: ModalType;
  label?: string;
  onUserCreated?: () => void;
}

const CreateButton = ({ type, label = 'Crear', onUserCreated }: Props) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const renderModal = () => {
    switch (type) {
      case 'order':
        return open ? <OrderForm open={open} onClose={handleClose} /> : null;
      case 'user':
        return (
          <UserModal
            open={open}
            onClose={handleClose}
            type="post"
            disabled={false}
            onUserCreated={onUserCreated}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label={label}
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

      {renderModal()}
    </>
  );
};

export default CreateButton;
