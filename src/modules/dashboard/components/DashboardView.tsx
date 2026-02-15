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

const MostVisitedBuildingsChart = dynamic(
  () => import('./charts').then((mod) => mod.MostVisitedBuildingsChart),
  {
    loading: () => (
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    ),
    ssr: false,
  }
);

const UsersCountChart = dynamic(() => import('./charts').then((mod) => mod.UsersCountChart), {
  loading: () => (
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  ),
  ssr: false,
});

const WelcomeCard = dynamic(() => import('./WelcomeCard').then((mod) => mod.WelcomeCard), {
  ssr: false,
});

export default function DashboardView() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pr: 5 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
          gap: 3,
        }}
      >
        <OrderStatusChart />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <WelcomeCard />
          <UsersCountChart />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
          gap: 3,
        }}
      >
        <MantenimientoCategoriasChart />
        <MostVisitedBuildingsChart />
      </Box>
    </Box>
  );
}
