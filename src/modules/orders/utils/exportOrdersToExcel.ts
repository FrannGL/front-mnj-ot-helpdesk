// eslint-disable-next-line import/no-extraneous-dependencies
import * as XLSX from 'xlsx';

import { fDate } from 'src/shared/utils/format-time';

import type { Order } from '../interfaces';

export const exportOrdersToExcel = (orders: Order[], filename?: string) => {
  const data = orders.map((order) => ({
    Código: `#OT${order.id}`,
    Título: order.titulo,
    Solicitante: order.cliente.username,
    Edificio: order.edificio_display || 'N/A',
    Piso: order.piso != null ? `Piso ${order.piso}` : 'N/A',
    Oficina: order.oficina ? `Oficina ${order.oficina}` : 'N/A',
    Sector: order.sector_display || 'N/A',
    Estado: order.estado_display || 'N/A',
    Prioridad: order.prioridad_display,
    'Agentes Asignados':
      order.agentes.length > 0 ? order.agentes.map((a) => a.username).join(', ') : 'Sin Asignar',
    Categorías:
      order.tags && order.tags.length > 0
        ? order.tags.map((t) => t.tag).join(', ')
        : 'Sin Categorías',
    'Fecha de Creación': fDate(order.created_at, 'DD-MM-YYYY h:mm a'),
    Detalle: order.detalle || 'N/A',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Órdenes de Trabajo');

  const columnWidths = [
    { wch: 10 },
    { wch: 30 },
    { wch: 20 },
    { wch: 25 },
    { wch: 12 },
    { wch: 15 },
    { wch: 20 },
    { wch: 15 },
    { wch: 12 },
    { wch: 30 },
    { wch: 25 },
    { wch: 22 },
    { wch: 50 },
  ];
  worksheet['!cols'] = columnWidths;

  const defaultFilename = `ordenes_trabajo_${fDate(new Date(), 'DD-MM-YYYY')}.xlsx`;
  const finalFilename = filename || defaultFilename;

  XLSX.writeFile(workbook, finalFilename);
};
