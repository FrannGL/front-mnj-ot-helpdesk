import type { ApexOptions } from 'apexcharts';

import ReactApexChart from 'react-apexcharts';
import { useMemo, useState, useEffect } from 'react';

import { useTheme } from '@mui/material/styles';
import { Box, Card, CardHeader } from '@mui/material';

import { useAllOrders } from 'src/modules/orders/hooks';
import { statusColorMap } from 'src/modules/orders/utils';
import { OrderStatusEnum } from 'src/modules/orders/enums';

export function OrderStatusChart() {
  const theme = useTheme();
  const { data } = useAllOrders();

  const chartOptions = useMemo<ApexOptions>(
    () => ({
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
          track: {
            background: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#EBEBEB',
            strokeWidth: '97%',
            margin: 5,
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
    }),
    [theme]
  );

  const [series, setSeries] = useState([0, 0, 0]);

  useEffect(() => {
    if (data && data.length > 0) {
      const statusCounts = data.reduce(
        (acc: any, order: any) => {
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

      setSeries([
        statusCounts[OrderStatusEnum.RESUELTO],
        statusCounts[OrderStatusEnum.CANCELADO],
        statusCounts[OrderStatusEnum.ABIERTO],
      ]);
    }
  }, [data]);

  if (data && data.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader title="Estado de Órdenes" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="radialBar"
          height={360}
          width="100%"
          key={theme.palette.mode}
        />
      </Box>
    </Card>
  );
}
