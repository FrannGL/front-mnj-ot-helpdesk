'use client';

import Image from 'next/image';
import { useEffect } from 'react';

import { Warning } from '@mui/icons-material';
import { Box, Stack, Button, Container, Typography } from '@mui/material';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          gap: 2,
        }}
      >
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
          <Warning sx={{ color: 'error.main' }} />

          <Typography variant="h4" color="error" gutterBottom>
            ¡Ups! Algo salió mal
          </Typography>
        </Stack>

        <Image
          width={700}
          height={375}
          src="/assets/images/error/no-data.svg"
          alt="Error Illustration"
          priority
        />

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Lo sentimos, ha ocurrido un error inesperado. Nuestro equipo ha sido notificado y estamos
          trabajando para solucionarlo.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => reset()}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            textTransform: 'none',
            fontSize: '1.1rem',
          }}
        >
          Intentar nuevamente
        </Button>
      </Box>
    </Container>
  );
}
