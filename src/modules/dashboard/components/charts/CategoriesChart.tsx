import type { ApexOptions } from 'apexcharts';

import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

import { Box, Card, useTheme, CardHeader, Typography } from '@mui/material';

import { useAllTags } from 'src/modules/tags/hooks';
import { useAllOrders } from 'src/modules/orders/hooks';

// ----------------------------------------------------------------------

export function MantenimientoCategoriasChart() {
  const theme = useTheme();
  const { tags, isLoading: isLoadingTags } = useAllTags();
  const { data: orders, isLoading: isLoadingOrders } = useAllOrders();

  const isLoading = isLoadingTags || isLoadingOrders;

  const chartData = useMemo(() => {
    if (!tags || tags.length === 0) return [];
    if (!orders) return [];

    return tags
      .map((tag) => ({
        label: tag.nombre,
        value: orders.filter((order: any) => order.tags?.some((t: any) => t.id === tag.id)).length,
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [tags, orders]);

  const chartSeries = chartData.map((i) => i.value);
  const chartLabels = chartData.map((i) => i.label);

  const chartOptions = useMemo<ApexOptions>(
    () => ({
      chart: {
        background: 'transparent',
        type: 'donut',
      },
      labels: chartLabels,
      stroke: {
        colors: [theme.palette.background.paper],
        width: 3,
      },
      colors: [
        '#3f51b5',
        '#f50057',
        '#ff9800',
        '#4caf50',
        '#2196f3',
        '#9c27b0',
        '#ff5722',
        '#795548',
        '#607d8b',
        '#e91e63',
      ],
      legend: {
        position: 'bottom',
        offsetY: 0,
        labels: {
          colors: theme.palette.text.primary,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5,
        },
      },
      dataLabels: {
        enabled: true,
        dropShadow: {
          enabled: false,
        },
      },
      tooltip: {
        fillSeriesColor: false,
        y: {
          formatter: (value: number) => `${value} órdenes`,
          title: {
            formatter: (seriesName: string) => `${seriesName}`,
          },
        },
        theme: theme.palette.mode,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              value: {
                offsetY: 8,
                color: theme.palette.text.primary,
                fontSize: '24px',
                fontWeight: 700,
                formatter: (val) => `${val}`,
              },
              total: {
                show: true,
                label: 'Total',
                color: theme.palette.text.secondary,
                fontSize: '12px',
                fontWeight: 600,
                formatter: (w) => {
                  const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                  return `${total}`;
                },
              },
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    }),
    [theme, chartLabels]
  );

  if (isLoading) {
    return (
      <Card sx={{ height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Cargando datos...</Typography>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader title="Categorías más demandadas" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart
          type="donut"
          series={chartSeries}
          options={chartOptions}
          height={360}
          width="100%"
        />
      </Box>
    </Card>
  );
}
