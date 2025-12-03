'use client';

import { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { Box, Stack, Button, Typography, CircularProgress } from '@mui/material';

import { ConfirmationModal } from 'src/shared/components/custom';

import { EdificioForm } from './EdificioForm';
import { EdificiosTable } from './EdificiosTable';
import { useEdificios } from '../hooks/useEdificios';
import { useEdificioMutations } from '../hooks/useEdificiosMutation';

import type { Edificio } from '../interfaces/edificio.interface';
import type { EdificioFormData } from '../schemas/edificio.schema';

interface PaginatedEdificiosResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Edificio[];
}

interface EdificiosViewProps {
  initialData?: PaginatedEdificiosResponse;
}

const EdificiosView = ({ initialData }: EdificiosViewProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [edificioToDelete, setEdificioToDelete] = useState<number | null>(null);
  const [editEdificio, setEditEdificio] = useState<Edificio | null>(null);
  const [page, setPage] = useState(1);

  const { edificios, count, isLoading, error } = useEdificios(page, {
    initialData: page === 1 ? initialData : undefined,
  });
  const { createEdificio, updateEdificio, deleteEdificio } = useEdificioMutations();

  const handleOpenCreateModal = () => {
    setEditEdificio(null);
    setModalOpen(true);
  };

  const handleEditClick = (edificio: Edificio) => {
    setEditEdificio(edificio);
    setModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setEdificioToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setEditEdificio(null);
  };

  const handleConfirmDelete = () => {
    if (edificioToDelete !== null) {
      deleteEdificio.mutate(edificioToDelete);
      setDeleteModalOpen(false);
      setEdificioToDelete(null);
    }
  };

  const handleSubmitEdificio = (values: EdificioFormData) => {
    if (editEdificio) {
      updateEdificio.mutate({ ...editEdificio, nombre: values.nombre });
      setEditEdificio(null);
    } else {
      createEdificio.mutate(values);
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
          <Typography variant="h5">Listado de Edificios registrados</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
          >
            Nuevo Edificio
          </Button>
        </Stack>

        <EdificiosTable
          data={edificios}
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
          title="Eliminar Edificio"
          content="¿Estás seguro de que deseas eliminar este edificio? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
        />

        <EdificioForm
          open={modalOpen}
          onClose={handleCancel}
          onSubmit={handleSubmitEdificio}
          initialValues={editEdificio || { nombre: '' }}
        />
      </Box>
    </Stack>
  );
};

export default EdificiosView;
