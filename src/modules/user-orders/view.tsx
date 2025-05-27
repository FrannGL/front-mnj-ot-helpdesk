'use client';

import { useMemo, useState } from 'react';
import { Fira_Sans } from 'next/font/google';

import { Box, Stack, Typography, Pagination, useMediaQuery, CircularProgress } from '@mui/material';

import { CreateButton } from 'src/shared/components/custom/CreateButton';

import { AdminOrders } from '../admin-orders/AdminOrders';
import { useOrders, useDebouncedValue } from '../orders/hooks';
import { OrderChat, OrdersList, OrderSearchBar, OrdersFiltersMenu } from '../orders/components';

import type { OrderFilters } from '../orders/types';

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
});

// ----------------------------------------------------------------------

export function OrdersView() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<OrderFilters>({
    cliente: undefined,
    status: undefined,
    priority: undefined,
    assignedTo: undefined,
    searchTerm: undefined,
  });

  const debouncedSearchTerm = useDebouncedValue(filters.searchTerm, 1000);

  const debouncedFilters = useMemo(
    () => ({ ...filters, searchTerm: debouncedSearchTerm }),
    [filters, debouncedSearchTerm]
  );

  const { data, isLoading, isFetching, error } = useOrders(page, debouncedFilters);

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

  const showLoading = isLoading || isFetching;

  if (showLoading) {
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
              <OrderSearchBar filters={filters} onFiltersChange={handleFiltersChange} />
              <OrdersFiltersMenu filters={filters} onFiltersChange={handleFiltersChange} />
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
}
