'use client';

import dynamic from 'next/dynamic';

import { Box, Grid, Card, useTheme, Typography } from '@mui/material';

// Chart components
const OrderStatusChart = dynamic(() => import('./charts').then((mod) => mod.OrderStatusChart), {
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <Typography>Cargando...</Typography>
    </Box>
  ),
  ssr: false,
});

const MantenimientoCategoriasChart = dynamic(
  () => import('./charts').then((mod) => mod.MantenimientoCategoriasChart),
  {
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Cargando...</Typography>
      </Box>
    ),
    ssr: false,
  }
);

const MostVisitedBuildingsChart = dynamic(
  () => import('./charts').then((mod) => mod.MostVisitedBuildingsChart),
  {
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Cargando...</Typography>
      </Box>
    ),
    ssr: false,
  }
);

const UsersCountChart = dynamic(() => import('./charts').then((mod) => mod.UsersCountChart), {
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <Typography>Cargando...</Typography>
    </Box>
  ),
  ssr: false,
});

const WelcomeCard = dynamic(() => import('./WelcomeCard').then((mod) => mod.WelcomeCard), {
  ssr: false,
});

// New KPI Cards
const OrdersKPICard = dynamic(() => import('./KPICards').then((mod) => mod.OrdersKPICard), {
  ssr: false,
});

const ResponseTimeCard = dynamic(() => import('./KPICards').then((mod) => mod.ResponseTimeCard), {
  ssr: false,
});

const CompletedTodayCard = dynamic(
  () => import('./KPICards').then((mod) => mod.CompletedTodayCard),
  {
    ssr: false,
  }
);

const EfficiencyCard = dynamic(() => import('./KPICards').then((mod) => mod.EfficiencyCard), {
  ssr: false,
});

// New Charts
const TrendsChart = dynamic(() => import('./charts').then((mod) => mod.TrendsChart), {
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <Typography>Cargando...</Typography>
    </Box>
  ),
  ssr: false,
});

export default function DashboardView() {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
      {/* Header Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <WelcomeCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <UsersCountChart />
        </Grid>
      </Grid>

      {/* Additional Insights Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.light}20 0%, ${theme.palette.primary.main}10 100%)`,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              📈 Insights Rápidos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Los edificios más activos requieren atención prioritaria
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Las categorías de mantenimiento eléctrico son las más solicitadas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • El tiempo promedio de respuesta es de 2.5 horas
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 3,
              background: `linear-gradient(135deg, ${theme.palette.success.light}20 0%, ${theme.palette.success.main}10 100%)`,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
              ✅ Acciones Recomendadas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Asignar más recursos a las categorías críticas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Optimizar rutas de mantenimiento por edificio
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Implementar sistema de alertas preventivas
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* KPIs Row */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <OrdersKPICard />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ResponseTimeCard />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CompletedTodayCard />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <EfficiencyCard />
        </Grid>
      </Grid>

      {/* Main Charts Row */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <OrderStatusChart />
        </Grid>
        <Grid item xs={12} lg={6}>
          <MantenimientoCategoriasChart />
        </Grid>
      </Grid>

      {/* Trends and Performance Row */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <TrendsChart />
        </Grid>
        <Grid item xs={12} lg={6}>
          <MostVisitedBuildingsChart />
        </Grid>
      </Grid>
    </Box>
  );
}
