import { Box, Card, Typography, CardContent } from '@mui/material';
import { TrendingUp, AccessTime, Assignment, CheckCircle } from '@mui/icons-material';

import { useAllOrders } from 'src/modules/orders/hooks';
import { OrderStatusEnum } from 'src/modules/orders/enums';

// ----------------------------------------------------------------------

export function OrdersKPICard() {
  const { data: orders } = useAllOrders();

  const totalOrders = orders?.length || 0;
  const pendingOrders =
    orders?.filter((order) => order.estado === OrderStatusEnum.ABIERTO).length || 0;
  const completedOrders =
    orders?.filter((order) => order.estado === OrderStatusEnum.RESUELTO).length || 0;
  const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

  return (
    <Card sx={{ height: 140 }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Órdenes Activas
          </Typography>
          <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
            {pendingOrders}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Tasa de completado: {completionRate}%
          </Typography>
        </Box>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'primary.main',
            color: 'white',
          }}
        >
          <Assignment sx={{ fontSize: 28 }} />
        </Box>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

export function ResponseTimeCard() {
  // Simulated data - you should calculate this from real order timestamps
  const avgResponseTime = 2.5; // hours
  const responseTimeChange = -15; // percentage change from last period

  return (
    <Card sx={{ height: 140 }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Tiempo Respuesta
          </Typography>
          <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
            {avgResponseTime}h
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TrendingUp
              sx={{
                fontSize: 16,
                color: responseTimeChange < 0 ? 'success.main' : 'error.main',
                transform: responseTimeChange < 0 ? 'rotate(180deg)' : 'none',
              }}
            />
            <Typography
              variant="caption"
              color={responseTimeChange < 0 ? 'success.main' : 'error.main'}
            >
              {Math.abs(responseTimeChange)}% vs mes anterior
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'success.main',
            color: 'white',
          }}
        >
          <AccessTime sx={{ fontSize: 28 }} />
        </Box>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

export function CompletedTodayCard() {
  const { data: orders } = useAllOrders();

  const today = new Date().toDateString();
  const completedToday =
    orders?.filter(
      (order) =>
        order.estado === OrderStatusEnum.RESUELTO &&
        new Date(order.updated_at).toDateString() === today
    ).length || 0;

  return (
    <Card sx={{ height: 140 }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Completadas Hoy
          </Typography>
          <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
            {completedToday}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Resueltas el día de hoy
          </Typography>
        </Box>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'success.main',
            color: 'white',
          }}
        >
          <CheckCircle sx={{ fontSize: 28 }} />
        </Box>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

export function EfficiencyCard() {
  const { data: orders } = useAllOrders();

  const totalOrders = orders?.length || 0;
  const completedOrders =
    orders?.filter((order) => order.estado === OrderStatusEnum.RESUELTO).length || 0;
  const efficiency = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

  return (
    <Card sx={{ height: 140 }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Eficiencia
          </Typography>
          <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
            {efficiency}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Tasa de resolución
          </Typography>
        </Box>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'info.main',
            color: 'white',
          }}
        >
          <TrendingUp sx={{ fontSize: 28 }} />
        </Box>
      </CardContent>
    </Card>
  );
}
