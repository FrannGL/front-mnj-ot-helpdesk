import { Box, Card, SvgIcon, Typography } from '@mui/material';

import { useAllUsers } from 'src/modules/users/hooks/useAllUsers';

// ----------------------------------------------------------------------

export function UsersCountChart() {
  const { users, isLoading } = useAllUsers();

  const totalUsers = users?.length || 0;

  if (isLoading) {
    return (
      <Card sx={{ display: 'flex', alignItems: 'center', p: 3, height: 132 }}>
        <Typography>Cargando...</Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, height: 132 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">Total Usuarios</Typography>
        <Typography variant="h3">{totalUsers}</Typography>
      </Box>

      <Box
        sx={{
          width: 80,
          height: 80,
          lineHeight: 0,
          borderRadius: '50%',
          bgcolor: 'background.neutral',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SvgIcon sx={{ width: 40, height: 40, color: 'primary.main' }}>
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </SvgIcon>
      </Box>
    </Card>
  );
}
