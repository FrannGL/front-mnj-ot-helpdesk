import type { ApexOptions } from 'apexcharts';

import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

import { Box, useTheme, Typography } from '@mui/material';

import { useAllTags } from 'src/modules/tags/hooks';

export function MantenimientoCategoriasChart() {
  const theme = useTheme();
  const { tags, isLoading } = useAllTags();

  // Contar cuántas órdenes hay por cada tag
  const tagCounts = useMemo(() => {
    if (!tags || tags.length === 0) return [];

    return tags
      .map((tag) => ({
        name: tag.nombre,
        count: 0, // Por ahora mostramos todos los tags con conteo 0 hasta tener la relación con órdenes
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 tags más usados
  }, [tags]);

  const series = useMemo(
    () => [
      {
        name: 'Órdenes',
        data: tagCounts.map((tag) => tag.count),
      },
    ],
    [tagCounts]
  );

  const categories = useMemo(() => tagCounts.map((tag) => tag.name), [tagCounts]);

  const chartOptions = useMemo<ApexOptions>(
    () => ({
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false,
          tools: {
            download: true,
            zoom: false,
            pan: false,
            reset: false,
          },
        },
        foreColor: theme.palette.text.primary,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: 'right',
          },
        },
      },
      stroke: {
        width: 1,
        colors: [theme.palette.background.paper],
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
          show: true,
          color: theme.palette.divider,
        },
        axisTicks: {
          color: theme.palette.divider,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: theme.palette.text.secondary,
          },
        },
      },
      tooltip: {
        y: {
          formatter: (val) => `${val} órdenes`,
        },
        theme: theme.palette.mode,
      },
      fill: {
        opacity: 1,
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
      },
      legend: {
        show: false,
      },
      grid: {
        borderColor: theme.palette.divider,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 200,
            },
            plotOptions: {
              bar: {
                dataLabels: {
                  total: {
                    style: {
                      fontSize: '10px',
                      fontWeight: 700,
                    },
                  },
                },
              },
            },
            xaxis: {
              labels: {
                style: {
                  fontSize: '10px',
                  colors: theme.palette.text.secondary,
                },
              },
            },
            yaxis: {
              labels: {
                style: {
                  fontSize: '10px',
                  colors: theme.palette.text.secondary,
                },
              },
            },
          },
        },
      ],
    }),
    [theme, categories]
  );

  if (isLoading) {
    return (
      <Box
        sx={{ p: 3, height: 350, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Typography>Cargando categorías...</Typography>
      </Box>
    );
  }

  if (!tags || tags.length === 0) {
    return (
      <Box
        sx={{ p: 3, height: 350, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Typography>No hay categorías disponibles</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, pl: 1, height: { xs: 280, sm: 350 } }}>
      <Typography variant="h6" sx={{ my: 1, pl: 2 }}>
        Top 10 Categorías más usadas
      </Typography>
      <ReactApexChart
        options={chartOptions}
        series={series}
        type="bar"
        height={chartOptions.chart?.height}
        key={theme.palette.mode}
      />
    </Box>
  );
}
