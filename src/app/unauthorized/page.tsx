'use client';

import Link from 'next/link';
import { m } from 'framer-motion';

import { Button, Container, Typography } from '@mui/material';

import { SimpleLayout } from 'src/shared/layouts/simple';
import { varBounce, MotionContainer } from 'src/shared/components/minimal/animate';
import ServerErrorIllustration from 'src/shared/components/minimal/illustrations/server-error-illustration';

export default function UnauthorizedPage() {
  return (
    <SimpleLayout content={{ compact: true }}>
      <Container component={MotionContainer}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            No autorizado
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            No tienes permiso para acceder a esta página. Por favor, contacta al administrador.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ServerErrorIllustration sx={{ my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button component={Link} href="/" size="large" variant="contained">
          Go to home
        </Button>
      </Container>
    </SimpleLayout>
  );
}
