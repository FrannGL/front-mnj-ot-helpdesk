'use client';

import Link from 'next/link';
import { z as zod } from 'zod';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, useTheme, Typography } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();

  const theme = useTheme();

  const callbackUrl = searchParams.get('callbackUrl');

  const defaultValues = {
    email: 'demo@minimals.cc',
    password: '@demo1',
  };

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Aquí harías la autenticación real con Auth.js
      // Después del login exitoso, redirigir a la URL de callback o dashboard
      const redirectUrl = callbackUrl || '/dashboard';
      router.push(redirectUrl);
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(error instanceof Error ? error.message : error);
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
          <Image src="/assets/images/logos/logo-white.png" alt="Logo" width={225} height={55} />
        ) : (
          <Image src="/assets/images/logos/logo-dark.png" alt="Logo" width={225} height={55} />
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
