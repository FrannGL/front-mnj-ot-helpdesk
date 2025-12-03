import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { request } from 'src/services';

import type { Edificio } from '../interfaces/edificio.interface';

export function useEdificioMutations() {
  const queryClient = useQueryClient();

  const createEdificio = useMutation({
    mutationFn: async (newEdificio: Omit<Edificio, 'id'>) => {
      const response = await request('edificios', 'POST', newEdificio);
      if (response.error || response.status >= 400) {
        throw new Error(response.error || `Error ${response.status}`);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edificios'] });
      toast.success('Edificio creado exitosamente.');
    },
    onError: (error: any) => {
      toast.error(`Error al crear edificio: ${error.message || 'Inténtalo de nuevo'}`);
    },
  });

  const updateEdificio = useMutation({
    mutationFn: async (edificio: Edificio) => {
      const response = await request(`edificios/${edificio.id}`, 'PUT', edificio);
      if (response.error || response.status >= 400) {
        throw new Error(response.error || `Error ${response.status}`);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edificios'] });
      toast.success('Edificio actualizado exitosamente.');
    },
    onError: (error: any) => {
      toast.error(`Error al actualizar edificio: ${error.message || 'Inténtalo de nuevo'}`);
    },
  });

  const deleteEdificio = useMutation({
    mutationFn: async (id: number) => {
      const response = await request(`edificios/${id}`, 'DELETE');
      if (response.error || response.status >= 400) {
        throw new Error(response.error || `Error ${response.status}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edificios'] });
      toast.success('Edificio eliminado exitosamente.');
    },
    onError: (error: any) => {
      toast.error(`Error al eliminar edificio: ${error.message || 'Inténtalo de nuevo'}`);
    },
  });

  return {
    createEdificio,
    updateEdificio,
    deleteEdificio,
  };
}
