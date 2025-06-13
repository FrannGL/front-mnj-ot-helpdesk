import { useState } from 'react';

import Fab from '@mui/material/Fab';
import { Add as AddIcon } from '@mui/icons-material';

import OrderForm from './OrderForm';
import { UserModal } from '../../users/components/UserModal';

type ModalType = 'order' | 'user';

interface Props {
  type: ModalType;
  label?: string;
}

const CreateButton = ({ type, label = 'Crear' }: Props) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const renderModal = () => {
    switch (type) {
      case 'order':
        return <OrderForm open={open} onClose={handleClose} />;
      case 'user':
        return <UserModal open={open} onClose={handleClose} type="post" disabled={false} />;
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
