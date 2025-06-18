'use client';

import { Box, Stack, Typography, CircularProgress } from '@mui/material';

import { GroupsTable } from './GroupsTable';
import { useGroups } from '../hooks/useGroups';

const GroupsView = () => {
  const { data, isLoading, error } = useGroups();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error al cargar los datos</Typography>;
  }

  return (
    <Stack direction="column" width="100%" justifyContent="center" alignItems="center">
      <Box
        sx={{
          width: '90%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          mt: 5,
        }}
      >
        <Stack width="100%" direction="row" justifyContent="space-between">
          <Typography variant="h5">Listado de Grupos registrados</Typography>
        </Stack>

        <GroupsTable data={data} />
      </Box>
    </Stack>
  );
};

export default GroupsView;
