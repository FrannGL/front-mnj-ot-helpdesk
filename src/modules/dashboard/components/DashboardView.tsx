'use client';

import dynamic from 'next/dynamic';

import { Box, CircularProgress } from '@mui/material';

const OrderStatusChart = dynamic(() => import('./charts').then((mod) => mod.OrderStatusChart), {
  loading: () => (
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  ),
  ssr: false,
});

const MantenimientoCategoriasChart = dynamic(
  () => import('./charts').then((mod) => mod.MantenimientoCategoriasChart),
  {
    loading: () => (
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    ),
    ssr: false,
  }
);

export default function DashboardView() {
  return (
    <div>
      <OrderStatusChart />
      <MantenimientoCategoriasChart />
    </div>
  );
}
