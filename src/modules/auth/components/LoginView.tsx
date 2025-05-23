'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, useTheme, Typography } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/shared/components/minimal/iconify';
import { useBoolean } from 'src/shared/hooks/minimal/use-boolean';
import { Form, Field } from 'src/shared/components/minimal/hook-form';

import { LoginSchema } from '../schemas';

import type { LoginSchemaType } from '../schemas';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();

  const theme = useTheme();

  const callbackUrl = searchParams.get('callbackUrl');

  const defaultValues = {
    email: 'demouser@jst.gob.ar',
    password: '@demo1',
  };

  const methods = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setErrorMsg(result.error);
        return;
      }

      const redirectUrl = callbackUrl || '/dashboard';
      router.push(redirectUrl);
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(error instanceof Error ? error.message : 'Error al iniciar sesión');
    }
  });

  // Función para mostrar el nombre de la ruta de manera amigable
  const getRouteName = (path: string) => {
    const routeNames: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/operations': 'Operaciones',
      // Agrega más rutas según necesites
    };

    return routeNames[path] || path;
  };

  const renderRegisterLink = (
    <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center', mt: 2 }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        ¿No tienes cuenta?
      </Typography>
      <Link
        href="/auth/register"
        style={{
          fontSize: 15,
          textDecoration: 'none',
          color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main,
        }}
      >
        Regístrate aquí
      </Link>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text name="email" label="Email address" InputLabelProps={{ shrink: true }} />

      <Stack spacing={1.5}>
        <Field.Text
          name="password"
          label="Password"
          placeholder="6+ characters"
          type={password.value ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Sign in..."
      >
        Sign in
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        {theme.palette.mode === 'dark' ? (
          <Image src="/logo/logo-white.png" alt="Logo" width={225} height={55} />
        ) : (
          <Image src="/logo/logo-dark.png" alt="Logo" width={225} height={55} />
        )}
      </Box>

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      {callbackUrl ? (
        <Alert severity="warning" sx={{ mb: 3, mt: 3 }}>
          Debes iniciar sesión para acceder a <strong>{getRouteName(callbackUrl)}</strong>
        </Alert>
      ) : (
        <Alert severity="info" sx={{ mb: 3, mt: 3 }}>
          Por favor, inicia sesión para comenzar
        </Alert>
      )}

      {renderRegisterLink}
    </>
  );
}
