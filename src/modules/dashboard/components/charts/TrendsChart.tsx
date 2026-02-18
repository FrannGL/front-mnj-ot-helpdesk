import type { ApexOptions } from 'apexcharts';

import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

import { Box, Card, useTheme, CardHeader } from '@mui/material';

import { useAllOrders } from 'src/modules/orders/hooks';
import { OrderStatusEnum } from 'src/modules/orders/enums';

// ----------------------------------------------------------------------

export function TrendsChart() {
  const theme = useTheme();
  const { data: orders } = useAllOrders();

  const chartData = useMemo(() => {
    if (!orders || orders.length === 0) return { series: [], categories: [] };

    // Group orders by date for the last 7 days
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push(date.toDateString());
    }

    const ordersByDate = last7Days.map((date) => {
      const dayOrders = orders.filter(
        (order) => new Date(order.created_at).toDateString() === date
      );

      return {
        date: new Date(date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
        created: dayOrders.length,
        completed: dayOrders.filter((order) => order.estado === OrderStatusEnum.RESUELTO).length,
        pending: dayOrders.filter((order) => order.estado === OrderStatusEnum.ABIERTO).length,
      };
    });

    return {
      series: [
        { name: 'Creadas', data: ordersByDate.map((d) => d.created) },
        { name: 'Completadas', data: ordersByDate.map((d) => d.completed) },
        { name: 'Pendientes', data: ordersByDate.map((d) => d.pending) },
      ],
      categories: ordersByDate.map((d) => d.date),
    };
  }, [orders]);

  const chartOptions = useMemo<ApexOptions>(
    () => ({
      chart: {
        type: 'line',
        height: 350,
        zoom: { enabled: false },
        toolbar: { show: false },
      },
      colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main],
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      markers: {
        size: 4,
        colors: [theme.palette.background.paper],
        strokeColors: [
          theme.palette.primary.main,
          theme.palette.success.main,
          theme.palette.warning.main,
        ],
        strokeWidth: 2,
      },
      xaxis: {
        categories: chartData.categories,
        labels: {
          style: {
            colors: theme.palette.text.secondary,
            fontSize: '12px',
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          formatter: (val: number) => val.toFixed(0),
          style: {
            colors: theme.palette.text.secondary,
          },
        },
      },
      grid: {
        strokeDashArray: 3,
        borderColor: theme.palette.divider,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: {
          colors: theme.palette.text.primary,
        },
      },
      tooltip: {
        theme: theme.palette.mode,
        y: {
          formatter: (val: number) => `${val} órdenes`,
        },
      },
      dataLabels: {
        enabled: false,
      },
    }),
    [theme, chartData.categories]
  );

  if (chartData.series.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader title="Tendencias de la Semana" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart
          type="line"
          series={chartData.series}
          options={chartOptions}
          height={350}
          width="100%"
        />
      </Box>
    </Card>
  );
}
