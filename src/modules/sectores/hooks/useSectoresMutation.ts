import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { request } from 'src/services';

import type { Sector } from '../interfaces/sector.interface';

export function useSectorMutations() {
  const queryClient = useQueryClient();

  const createSector = useMutation({
    mutationFn: async (newSector: Omit<Sector, 'id'>) => {
      const response = await request('sectores', 'POST', newSector);
      if (response.error || response.status >= 400) {
        throw new Error(response.error || `Error ${response.status}`);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectores'] });
      toast.success('Sector creado exitosamente.');
    },
    onError: (error: any) => {
      toast.error(`Error al crear sector: ${error.message || 'Inténtalo de nuevo'}`);
    },
  });

  const updateSector = useMutation({
    mutationFn: async (sector: Sector) => {
      const response = await request(`sectores/${sector.id}`, 'PUT', sector);
      if (response.error || response.status >= 400) {
        throw new Error(response.error || `Error ${response.status}`);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectores'] });
      toast.success('Sector actualizado exitosamente.');
    },
    onError: (error: any) => {
      toast.error(`Error al actualizar sector: ${error.message || 'Inténtalo de nuevo'}`);
    },
  });

  const deleteSector = useMutation({
    mutationFn: async (id: number) => {
      const response = await request(`sectores/${id}`, 'DELETE');
      if (response.error || response.status >= 400) {
        throw new Error(response.error || `Error ${response.status}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectores'] });
      toast.success('Sector eliminado exitosamente.');
    },
    onError: (error: any) => {
      toast.error(`Error al eliminar sector: ${error.message || 'Inténtalo de nuevo'}`);
    },
  });

  return {
    createSector,
    updateSector,
    deleteSector,
  };
}
