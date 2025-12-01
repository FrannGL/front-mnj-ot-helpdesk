'use client';

import { useMemo, useState } from 'react';
import { Fira_Sans } from 'next/font/google';

import { Box, Stack, Typography, Pagination, useMediaQuery, CircularProgress } from '@mui/material';

import CreateButton from 'src/modules/orders/components/CreateButton';

import { OrderChat } from './OrderChat';
import AdminOrders from './desktop/AdminOrders';
import OrdersList from './mobile/List/OrdersList';
import { useOrders, useDebouncedValue } from '../hooks';
import { MobileSearchBar, MobileFilterMenu } from './mobile/Filters';

import type { OrderFilters } from '../types';
import type { ServerResponse } from '../interfaces';

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
});

// ----------------------------------------------------------------------

interface OrdersViewProps {
  initialData?: ServerResponse;
}

const OrdersView = ({ initialData }: OrdersViewProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<OrderFilters>({
    cliente: undefined,
    status: undefined,
    priority: undefined,
    assignedTo: undefined,
    searchTerm: undefined,
    tags: undefined,
  });

  const debouncedSearchTerm = useDebouncedValue(filters.searchTerm, 1000);

  const debouncedFilters = useMemo(
    () => ({ ...filters, searchTerm: debouncedSearchTerm }),
    [filters, debouncedSearchTerm]
  );

  const { data, isLoading, error } = useOrders(page, debouncedFilters, {
    initialData: page === 1 ? initialData : undefined,
  });

  const isMobileScreen = useMediaQuery('(max-width:600px)');

  const filteredOrders = data?.results ?? [];

  const handleOrderClick = (orderId: number) => {
    setSelectedOrderId(orderId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrderId(null);
  };

  const handleFiltersChange = (newFilters: OrderFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const totalPages = useMemo(() => {
    if (!data) return 1;

    if (data.next || !data.previous) {
      const pageSize = data.results.length;
      return Math.ceil(data.count / Math.max(pageSize, 1));
    }

    return page;
  }, [data, page]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data?.results.length) {
    return (
      <>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <Typography>No hay tareas disponibles</Typography>
        </Box>
        <CreateButton type="order" />
      </>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={400}
        flexDirection="column"
        gap={2}
      >
        <Typography color="error" variant="h6">
          Error al cargar las órdenes
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Stack direction="row" spacing={2}>
      <Stack width="100%" direction="column" sx={{ px: 2 }}>
        {isMobileScreen && (
          <Typography
            variant="h4"
            sx={{
              fontFamily: `${firaSans.style.fontFamily} !important`,
              lineHeight: 1.3,
              pl: 1,
              mb: 2,
            }}
            gutterBottom
          >
            Listado de Ordenes
          </Typography>
        )}
        {isMobileScreen ? (
          <Stack
            width="100%"
            direction="column"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
            sx={{ px: 1, mb: 1 }}
          >
            <Stack
              width="100%"
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
            >
              <MobileSearchBar filters={filters} onFiltersChange={handleFiltersChange} />
              <MobileFilterMenu filters={filters} onFiltersChange={handleFiltersChange} />
            </Stack>

            <Stack width="100%" direction="column" justifyContent="center" alignItems="center">
              <OrdersList orders={filteredOrders ?? []} onOrderClick={handleOrderClick} />
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                sx={{ py: 2 }}
              />
            </Stack>
          </Stack>
        ) : (
          <AdminOrders />
        )}

        {selectedOrderId && (
          <OrderChat orderId={selectedOrderId} open={openDialog} onClose={handleCloseDialog} />
        )}
      </Stack>
      <CreateButton type="order" />
    </Stack>
  );
};

export default OrdersView;
