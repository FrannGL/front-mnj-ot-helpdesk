'use client';

import { Fira_Sans } from 'next/font/google';

import { Box, Stack, Typography } from '@mui/material';

import CreateButton from '../CreateButton';
import { useAdminOrders } from '../../hooks';
import OrdersTable from './OrdersTable/OrdersTable';

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
});

const AdminOrders = () => {
  const { orders, error } = useAdminOrders();

  if (error) {
    return (
      <Stack sx={{ px: 3 }} spacing={1}>
        <Typography
          variant="h4"
          sx={{ fontFamily: `${firaSans.style.fontFamily} !important`, lineHeight: 1.3, pl: 1 }}
          gutterBottom
        >
          Administrar Tareas
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={400}
          flexDirection="column"
          gap={2}
        >
          <Typography color="error" variant="h6">
            Error al cargar las órdenes
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {error.message}
          </Typography>
        </Box>
      </Stack>
    );
  }

  if (!orders.length) {
    return (
      <Stack sx={{ px: 3 }} spacing={1}>
        <Typography
          variant="h4"
          sx={{ fontFamily: `${firaSans.style.fontFamily} !important`, lineHeight: 1.3, pl: 1 }}
          gutterBottom
        >
          Administrar Tareas
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <Typography>No se encontraron resultados con los parámetros otorgados</Typography>
        </Box>
        <CreateButton type="order" />
      </Stack>
    );
  }

  return (
    <Stack sx={{ px: 3 }} spacing={1}>
      <Typography
        variant="h4"
        sx={{ fontFamily: `${firaSans.style.fontFamily} !important`, lineHeight: 1.3, pl: 1 }}
        gutterBottom
      >
        Administrar Tareas
      </Typography>

      <OrdersTable />

      <CreateButton type="order" />
    </Stack>
  );
};

export default AdminOrders;
