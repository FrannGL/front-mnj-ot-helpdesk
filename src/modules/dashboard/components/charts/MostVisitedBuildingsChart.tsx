import type { ApexOptions } from 'apexcharts';

import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

import { Box, Card, useTheme, CardHeader, Typography } from '@mui/material';

import { useAllOrders } from 'src/modules/orders/hooks';
import { useAllEdificios } from 'src/modules/edificios/hooks/useAllEdificios';

export function MostVisitedBuildingsChart() {
  const theme = useTheme();
  const { edificios, isLoading: isLoadingEdificios } = useAllEdificios();
  const { data: orders, isLoading: isLoadingOrders } = useAllOrders();

  const isLoading = isLoadingEdificios || isLoadingOrders;

  const chartData = useMemo(() => {
    if (!edificios || edificios.length === 0) return [];
    if (!orders) return [];

    return edificios
      .map((edificio) => ({
        label: edificio.nombre,
        value: orders.filter((order: any) => order.edificio === edificio.id).length,
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [edificios, orders]);

  const series = useMemo(
    () => [{ name: 'Visitas', data: chartData.map((i) => i.value) }],
    [chartData]
  );
  const categories = useMemo(() => chartData.map((i) => i.label), [chartData]);

  const chartOptions = useMemo<ApexOptions>(
    () => ({
      chart: {
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      colors: [
        theme.palette.primary.main,
        theme.palette.info.main,
        theme.palette.warning.main,
        theme.palette.error.main,
        theme.palette.success.main,
        theme.palette.secondary.main,
        '#3f51b5',
        '#9c27b0',
        '#ff5722',
        '#607d8b',
      ],
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
          borderRadius: 4,
          dataLabels: {
            position: 'top',
          },
        },
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories,
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
      tooltip: {
        theme: theme.palette.mode,
        y: {
          formatter: (val: number) => `${val} visitas`,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val}`,
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: [theme.palette.text.primary],
        },
      },
    }),
    [theme, categories]
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
      <CardHeader title="Edificios más visitados" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart
          type="bar" // Default is column (vertical)
          series={series}
          options={chartOptions}
          height={360}
          width="100%"
        />
      </Box>
    </Card>
  );
}
