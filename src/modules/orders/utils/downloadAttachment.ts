import { request } from 'src/shared/services/request';

export async function downloadAttachment(messageId: number, fileName: string) {
  try {
    const response = await request(`mensajes/${messageId}/${fileName}`, 'GET', undefined, 'blob');

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al descargar el archivo:', error);
  }
}
