'use client';

import { useMemo, useState } from 'react';
import { Fira_Sans } from 'next/font/google';

import { Box, Stack, Typography, Pagination, useMediaQuery, CircularProgress } from '@mui/material';

import { applyFilters } from 'src/modules/orders/utils';
import { OrdersList } from 'src/modules/orders/components/OrdersList';

import { CreateButton } from 'src/components/CreateButton';

import { useOrders, useOrderById } from '../orders/hooks/useOrders';
import { OrderChat, OrdersFilter, OrderSearchBar, OrdersFiltersMenu } from '../orders/components';

import type { OrderFilters } from '../orders/types';

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
});

// ----------------------------------------------------------------------

export function OrdersView() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<OrderFilters>({
    cliente: undefined,
    status: undefined,
    priority: undefined,
    assignedTo: undefined,
    searchTerm: undefined,
  });

  const { data, isLoading, isFetching, hasActiveFilters } = useOrders(page, filters);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const { data: selectedOrder } = useOrderById(selectedOrderId);

  const isMobileScreen = useMediaQuery('(max-width:600px)');

  const filteredOrders = useMemo(
    () => (data?.results ? applyFilters(data.results, filters) : []),
    [data?.results, filters]
  );

  const handleOrderClick = (orderId: number) => {
    setSelectedOrderId(orderId);
    setOpenDialog(true);
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

  return (
    <Stack direction="row" spacing={2} sx={{ px: 2 }}>
      <Stack direction="column" sx={{ flex: 1 }}>
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
        {isMobileScreen ? (
          <Stack
            width="97%"
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
            sx={{ px: 1, mb: 1 }}
          >
            <OrderSearchBar filters={filters} onFiltersChange={handleFiltersChange} />
            <OrdersFiltersMenu filters={filters} onFiltersChange={handleFiltersChange} />
          </Stack>
        ) : (
          <OrdersFilter
            filters={filters}
            onFiltersChange={handleFiltersChange}
            hasActiveFilters={hasActiveFilters}
          />
        )}

        <Box sx={{ width: '100%', pt: 1 }}>
          <OrdersList orders={filteredOrders ?? []} onOrderClick={handleOrderClick} />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>

        {selectedOrder && (
          <OrderChat
            order={selectedOrder.data}
            open={openDialog}
            onClose={() => setOpenDialog(false)}
          />
        )}
      </Stack>
      <CreateButton type="order" />
    </Stack>
  );
}
