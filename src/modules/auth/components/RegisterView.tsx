'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/config/paths';
import { Iconify } from 'src/shared/components/minimal/iconify';
import { useBoolean } from 'src/shared/hooks/minimal/use-boolean';
import { Form, Field } from 'src/shared/components/minimal/hook-form';

import { RegisterSchema } from '../schemas/register.schema';

import type { RegisterSchemaType } from '../schemas/register.schema';

// ----------------------------------------------------------------------

export function RegisterView() {
  const router = useRouter();

  const password = useBoolean();

  const [errorMsg, setErrorMsg] = useState('');

  const defaultValues = {
    username: '',
    email: '',
    password: '',
  };

  const methods = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setErrorMsg('');
    const result = await signIn('credentials', {
      ...data,
      groups: JSON.stringify([1, 3]),
      redirect: false,
    });

    if (result?.error) {
      setErrorMsg(result.error);
      return;
    }

    router.push(paths.dashboard.root);
  });

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">Comienza gratis</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          ¿Ya tienes una cuenta?
        </Typography>

        <Link component={Link} href={paths.auth.jwt.signIn} variant="subtitle2">
          Iniciar sesión
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text name="username" label="Nombre de usuario" InputLabelProps={{ shrink: true }} />

      <Field.Text name="email" label="Correo electrónico" InputLabelProps={{ shrink: true }} />

      <Field.Text
        name="password"
        label="Contraseña"
        placeholder="6+ caracteres"
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

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Creando cuenta..."
      >
        Crear cuenta
      </LoadingButton>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        mt: 3,
        textAlign: 'center',
        typography: 'caption',
        color: 'text.secondary',
      }}
    >
      {'Al registrarte, aceptas nuestros '}
      <Link underline="always" color="text.primary">
        Términos de servicio
      </Link>
      {' y '}
      <Link underline="always" color="text.primary">
        Política de privacidad
      </Link>
      .
    </Typography>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      {renderTerms}
    </>
  );
}
