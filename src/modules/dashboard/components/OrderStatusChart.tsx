import type { ApexOptions } from 'apexcharts';

import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

import { Box, Typography } from '@mui/material';

import { useOrders } from 'src/modules/orders/hooks';
import { statusColorMap } from 'src/modules/orders/utils';
import { OrderStatusEnum } from 'src/modules/orders/enums';

export function OrderStatusChart() {
  const { data } = useOrders();

  const [chartData, setChartData] = useState<{
    series: number[];
    options: ApexOptions;
  }>({
    series: [0, 0, 0],
    options: {
      chart: {
        height: 300,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: '30%',
            background: 'transparent',
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            },
          },
          barLabels: {
            enabled: true,
            useSeriesColors: true,
            offsetX: -8,
            fontSize: '13px',
            formatter(seriesName: string, opts: any) {
              return `${seriesName}: ${opts.w.globals.series[opts.seriesIndex]}`;
            },
          } as any,
        },
      },
      colors: [
        statusColorMap[OrderStatusEnum.RESUELTO],
        statusColorMap[OrderStatusEnum.CANCELADO],
        statusColorMap[OrderStatusEnum.ABIERTO],
      ],
      labels: ['Resueltos', 'Cancelados', 'Abiertos'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false,
            },
          },
        },
      ],
    },
  });

  useEffect(() => {
    if (data?.results) {
      const statusCounts = data.results.reduce(
        (acc, order) => {
          if (Object.prototype.hasOwnProperty.call(acc, order.estado)) {
            acc[order.estado] += 1;
          }
          return acc;
        },
        {
          [OrderStatusEnum.ABIERTO]: 0,
          [OrderStatusEnum.RESUELTO]: 0,
          [OrderStatusEnum.CANCELADO]: 0,
        }
      );

      const series = [
        statusCounts[OrderStatusEnum.RESUELTO],
        statusCounts[OrderStatusEnum.CANCELADO],
        statusCounts[OrderStatusEnum.ABIERTO],
      ];

      setChartData((prev) => ({
        ...prev,
        series,
      }));
    }
  }, [data]);

  return (
    <Box sx={{ p: 3, height: 300 }}>
      <Typography variant="h6">Ordenes</Typography>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="radialBar"
        height={300}
      />
    </Box>
  );
}
