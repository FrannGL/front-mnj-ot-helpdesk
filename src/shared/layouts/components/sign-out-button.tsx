import type { ButtonProps } from '@mui/material/Button';
import type { Theme, SxProps } from '@mui/material/styles';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';

// ----------------------------------------------------------------------

type Props = ButtonProps & {
  sx?: SxProps<Theme>;
  onClose?: () => void;
};

export function SignOutButton({ onClose, ...other }: Props) {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      onClose?.();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }, [onClose, router]);

  return (
    <Button fullWidth variant="soft" size="large" color="error" onClick={handleLogout} {...other}>
      Logout
    </Button>
  );
}
