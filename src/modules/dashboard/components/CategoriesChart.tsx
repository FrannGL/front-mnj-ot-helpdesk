import type { ApexOptions } from 'apexcharts';

import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

import { Box, useTheme, Typography } from '@mui/material';

const mantenimientoPorMes = [
  { nombre: 'Carpinteria', month: 'Marzo', count: 5 },
  { nombre: 'Carpinteria', month: 'Abril', count: 7 },
  { nombre: 'Carpinteria', month: 'Mayo', count: 6 },
  { nombre: 'Ferretería', month: 'Marzo', count: 3 },
  { nombre: 'Ferretería', month: 'Abril', count: 4 },
  { nombre: 'Ferretería', month: 'Mayo', count: 5 },
  { nombre: 'Electricidad', month: 'Marzo', count: 6 },
  { nombre: 'Electricidad', month: 'Abril', count: 7 },
  { nombre: 'Electricidad', month: 'Mayo', count: 7 },
  { nombre: 'Plomería', month: 'Marzo', count: 4 },
  { nombre: 'Plomería', month: 'Abril', count: 6 },
  { nombre: 'Plomería', month: 'Mayo', count: 5 },
];

export function MantenimientoCategoriasChart() {
  const theme = useTheme();
  const meses = useMemo(() => ['Marzo', 'Abril', 'Mayo'], []);
  const categorias = Array.from(new Set(mantenimientoPorMes.map((item) => item.nombre)));

  type Serie = {
    name: string;
    data: number[];
  };

  const series: Serie[] = categorias.map((categoria) => ({
    name: categoria,
    data: meses.map((mes) => {
      const record = mantenimientoPorMes.find(
        (item) => item.nombre === categoria && item.month === mes
      );
      return record ? record.count : 0;
    }),
  }));

  const chartOptions = useMemo<ApexOptions>(
    () => ({
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
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
            total: {
              enabled: false,
              offsetX: 0,
              style: {
                fontSize: '13px',
                fontWeight: 900,
                color: theme.palette.text.primary,
              },
            },
          },
        },
      },
      stroke: {
        width: 1,
        colors: [theme.palette.background.paper],
      },
      xaxis: {
        categories: meses,
        labels: {
          style: {
            colors: theme.palette.text.secondary,
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
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
        fontSize: '12px',
        labels: {
          colors: theme.palette.text.primary,
          useSeriesColors: false,
        },
        markers: {
          width: 12,
          height: 12,
          strokeWidth: 0,
          strokeColor: theme.palette.divider,
          radius: 2,
          offsetX: 15,
        },
        itemMargin: {
          horizontal: 1,
        },
        formatter(seriesName) {
          return `\u00A0\u00A0\u00A0\u00A0\u00A0${seriesName}`;
        },
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
            legend: {
              position: 'top',
              horizontalAlign: 'left',
              offsetX: -30,
              fontSize: '11px',
              markers: {
                width: 10,
                height: 10,
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
    [theme, meses]
  );

  return (
    <Box sx={{ p: 3, pl: 1, height: { xs: 280, sm: 350 } }}>
      <Typography variant="h6" sx={{ my: 1, pl: 2 }}>
        Categorías
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
