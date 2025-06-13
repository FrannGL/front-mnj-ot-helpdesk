import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { request } from 'src/services';

import type { Tag } from '../interfaces/tag.interface';

export function useTagMutations() {
  const queryClient = useQueryClient();

  const createTag = useMutation({
    mutationFn: async (newTag: Omit<Tag, 'id'>) => {
      const response = await request('tags', 'POST', newTag);
      if (response.error || response.status >= 400) {
        throw new Error(response.error || `Error ${response.status}`);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Tag creado exitosamente.');
    },
    onError: (error: any) => {
      toast.error(`Error al crear tag: ${error.message || 'Inténtalo de nuevo'}`);
    },
  });

  const updateTag = useMutation({
    mutationFn: async (tag: Tag) => {
      const response = await request(`tags/${tag.id}`, 'PUT', tag);
      if (response.error || response.status >= 400) {
        throw new Error(response.error || `Error ${response.status}`);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Tag actualizado exitosamente.');
    },
    onError: (error: any) => {
      toast.error(`Error al actualizar tag: ${error.message || 'Inténtalo de nuevo'}`);
    },
  });

  const deleteTag = useMutation({
    mutationFn: async (id: number) => {
      const response = await request(`tags/${id}`, 'DELETE');
      if (response.error || response.status >= 400) {
        throw new Error(response.error || `Error ${response.status}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Tag eliminado exitosamente.');
    },
    onError: (error: any) => {
      toast.error(`Error al eliminar tag: ${error.message || 'Inténtalo de nuevo'}`);
    },
  });

  return {
    createTag,
    updateTag,
    deleteTag,
  };
}
