import type { ApexOptions } from 'apexcharts';

import React from 'react';
import ReactApexChart from 'react-apexcharts';

import { Box, Typography } from '@mui/material';

const mantenimientoPorMes = [
  { nombre: 'Carpinteria', month: 'Enero', count: 5 },
  { nombre: 'Carpinteria', month: 'Febrero', count: 7 },
  { nombre: 'Carpinteria', month: 'Marzo', count: 6 },

  { nombre: 'Ferretería', month: 'Enero', count: 3 },
  { nombre: 'Ferretería', month: 'Febrero', count: 4 },
  { nombre: 'Ferretería', month: 'Marzo', count: 5 },

  { nombre: 'Electricidad', month: 'Enero', count: 6 },
  { nombre: 'Electricidad', month: 'Febrero', count: 7 },
  { nombre: 'Electricidad', month: 'Marzo', count: 7 },

  { nombre: 'Plomería', month: 'Enero', count: 4 },
  { nombre: 'Plomería', month: 'Febrero', count: 6 },
  { nombre: 'Plomería', month: 'Marzo', count: 5 },
];

export function MantenimientoCategoriasChart() {
  const meses = ['Enero', 'Febrero', 'Marzo'];
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

  const chartData: {
    series: Serie[];
    options: ApexOptions;
  } = {
    series,
    options: {
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
              },
            },
          },
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      xaxis: {
        categories: meses,
      },
      tooltip: {
        y: {
          formatter: (val) => `${val} órdenes`,
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
        fontSize: '14px',
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
                },
              },
            },
            yaxis: {
              labels: {
                style: {
                  fontSize: '10px',
                },
              },
            },
          },
        },
      ],
    },
  };

  return (
    <Box sx={{ p: 3, pl: 1, height: { xs: 280, sm: 350 } }}>
      <Typography variant="h6" sx={{ my: 1, pl: 2 }}>
        Categorías
      </Typography>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={chartData.options.chart?.height}
      />
    </Box>
  );
}
