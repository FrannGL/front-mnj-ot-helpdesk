'use client';

import { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { Box, Stack, Button, Typography, CircularProgress } from '@mui/material';

import { ConfirmationModal } from 'src/shared/components/custom';

import { SectorForm } from './SectorForm';
import { SectoresTable } from './SectoresTable';
import { useSectores } from '../hooks/useSectores';
import { useSectorMutations } from '../hooks/useSectoresMutation';

import type { Sector } from '../interfaces/sector.interface';
import type { SectorFormData } from '../schemas/sector.schema';

interface PaginatedSectoresResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Sector[];
}

interface SectoresViewProps {
  initialData?: PaginatedSectoresResponse;
}

const SectoresView = ({ initialData }: SectoresViewProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sectorToDelete, setSectorToDelete] = useState<number | null>(null);
  const [editSector, setEditSector] = useState<Sector | null>(null);
  const [page, setPage] = useState(1);

  const { sectores, count, isLoading, error } = useSectores(page, {
    initialData: page === 1 ? initialData : undefined,
  });
  const { createSector, updateSector, deleteSector } = useSectorMutations();

  const handleOpenCreateModal = () => {
    setEditSector(null);
    setModalOpen(true);
  };

  const handleEditClick = (sector: Sector) => {
    setEditSector(sector);
    setModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setSectorToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setEditSector(null);
  };

  const handleConfirmDelete = () => {
    if (sectorToDelete !== null) {
      deleteSector.mutate(sectorToDelete);
      setDeleteModalOpen(false);
      setSectorToDelete(null);
    }
  };

  const handleSubmitSector = (values: SectorFormData) => {
    if (editSector) {
      updateSector.mutate({ ...editSector, nombre: values.nombre });
      setEditSector(null);
    } else {
      createSector.mutate(values);
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
          <Typography variant="h5">Listado de Sectores registrados</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
          >
            Nuevo Sector
          </Button>
        </Stack>

        <SectoresTable
          data={sectores}
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
          title="Eliminar Sector"
          content="¿Estás seguro de que deseas eliminar este sector? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
        />

        <SectorForm
          open={modalOpen}
          onClose={handleCancel}
          onSubmit={handleSubmitSector}
          initialValues={editSector || { nombre: '' }}
        />
      </Box>
    </Stack>
  );
};

export default SectoresView;
