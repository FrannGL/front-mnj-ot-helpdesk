'use client';

import { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { Box, Stack, Button, Typography, CircularProgress } from '@mui/material';

import { ConfirmationModal } from 'src/shared/components/custom';

import { TagForm } from './TagForm';
import { TagsTable } from './TagsTable';
import { useTags } from '../hooks/useTags';
import { useTagMutations } from '../hooks/useTagsMutation';

import type { Tag } from '../interfaces/tag.interface';
import type { TagFormData } from '../schemas/tag.schema';

interface PaginatedTagsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Tag[];
}

interface TagsViewProps {
  initialData?: PaginatedTagsResponse;
}

const TagsView = ({ initialData }: TagsViewProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<number | null>(null);
  const [editTag, setEditTag] = useState<Tag | null>(null);
  const [page, setPage] = useState(1);

  const { tags, count, isLoading, error } = useTags(page, {
    initialData: page === 1 ? initialData : undefined,
  });
  const { createTag, updateTag, deleteTag } = useTagMutations();

  const handleOpenCreateModal = () => {
    setEditTag(null);
    setModalOpen(true);
  };

  const handleEditClick = (tag: Tag) => {
    setEditTag(tag);
    setModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setTagToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setEditTag(null);
  };

  const handleConfirmDelete = () => {
    if (tagToDelete !== null) {
      deleteTag.mutate(tagToDelete);
      setDeleteModalOpen(false);
      setTagToDelete(null);
    }
  };

  const handleSubmitTag = (values: TagFormData) => {
    if (editTag) {
      updateTag.mutate({ ...editTag, nombre: values.nombre });
      setEditTag(null);
    } else {
      createTag.mutate(values);
    }
    setModalOpen(false);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error al cargar los datos</Typography>;
  }

  return (
    <Stack direction="column" width="100%" justifyContent="center" alignItems="center">
      <Box
        sx={{
          width: '90%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          mt: 5,
        }}
      >
        <Stack width="100%" direction="row" justifyContent="space-between">
          <Typography variant="h5">Listado de Tags registrados</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
          >
            Nuevo Tag
          </Button>
        </Stack>

        <TagsTable
          data={tags}
          totalCount={count}
          page={page}
          onPageChange={setPage}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />

        <ConfirmationModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Eliminar Tag"
          content="¿Estás seguro de que deseas eliminar este tag? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
        />

        <TagForm
          open={modalOpen}
          onClose={handleCancel}
          onSubmit={handleSubmitTag}
          initialValues={editTag || { nombre: '' }}
        />
      </Box>
    </Stack>
  );
};

export default TagsView;
