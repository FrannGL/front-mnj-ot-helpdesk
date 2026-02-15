import { Card, alpha, useTheme, Typography } from '@mui/material';

import { fDate } from 'src/shared/utils/format-time';

// ----------------------------------------------------------------------

export function WelcomeCard() {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.4)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
      }}
    >
      <Typography variant="h4" sx={{ mb: 1, color: 'text.primary' }}>
        ¡Bienvenido de nuevo! 👋
      </Typography>

      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        Hoy es {fDate(new Date(), 'dddd, D [de] MMMM [de] YYYY')}
      </Typography>
    </Card>
  );
}
