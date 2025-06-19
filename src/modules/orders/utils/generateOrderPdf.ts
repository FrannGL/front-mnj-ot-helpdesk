import jsPDF from 'jspdf';

export const generateOrderPdf = (order: {
  id: number;
  cliente: { username: string };
  titulo: string;
  estado_display: string;
  prioridad_display: string;
  agentes: { username: string }[];
  tags: { tag: string }[];
  created_at: string;
}) => {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF();
  let y = 20;

  const formatDate = (date: string) =>
    new Date(date).toLocaleString('es-AR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

  const logoBase64 =
    'data:image/png;base64,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';

  // Logo JST
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', 85, 10, 40, 9);
    y = 32;
  }

  // Título
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`Orden de trabajo #OT${order.id}`, 105, y, { align: 'center' });

  // Cuadro con datos
  y += 10;
  const startX = 20;
  const col1Width = 50;
  const col2Width = 120;
  const rowHeight = 10;

  const tableData = [
    ['Fecha de solicitud', formatDate(order.created_at)],
    ['Solicitante', order.cliente.username],
    ...(order.tags.length > 0 ? [['Categoría', order.tags.map((t) => t.tag).join(', ')]] : []),
    ['Prioridad', order.prioridad_display],
  ];

  tableData.forEach(([label, value], i) => {
    const rowY = y + i * rowHeight;

    // Bordes
    doc.rect(startX, rowY, col1Width, rowHeight);
    doc.rect(startX + col1Width, rowY, col2Width, rowHeight);

    // Textos
    doc.setFont('helvetica', 'normal');
    doc.text(`${label}:`, startX + 2, rowY + 7);
    doc.text(value, startX + col1Width + 2, rowY + 7);
  });

  y += tableData.length * rowHeight + 10;

  // Descripción
  doc.setFont('helvetica', 'bold');
  doc.text('Descripción del trabajo a realizar:', startX, y);
  y += 7;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(13);
  const lines = doc.splitTextToSize(order.titulo, 170);
  doc.text(lines, startX, y);
  y += lines.length * 7;

  // Agentes
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Agentes asignados:', startX, y);

  y += 7;
  doc.setFont('helvetica', 'normal');
  order.agentes.forEach((agente) => {
    doc.text(`- ${agente.username}`, startX + 5, y);
    y += 6;
  });

  // Firmas
  y += 50;
  doc.setLineWidth(0.1);

  doc.line(30, y + 15, 80, y + 15);
  doc.text('Firma del solicitante', 30, y + 20);

  doc.line(130, y + 15, 180, y + 15);
  doc.text('Firma del agente asignado', 130, y + 20);

  doc.save(`Remito_OT${order.id}.pdf`);
};
