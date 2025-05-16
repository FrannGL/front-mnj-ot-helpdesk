import { Search } from '@mui/icons-material';
import { useTheme, TextField, InputAdornment } from '@mui/material';

import { varAlpha } from 'src/theme/styles';

export function OrderSearchBar() {
  const theme = useTheme();

  return (
    <TextField
      size="small"
      placeholder="Buscar tareas..."
      variant="outlined"
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          border: 'none',
          outline: 'none',
          backgroundColor: () => varAlpha(theme.vars.palette.grey['500Channel'], 0.1),
          color:
            theme.palette.mode === 'dark'
              ? theme.palette.primary.light
              : theme.palette.primary.darker,
          '& fieldset': {
            border: 'none',
          },
          '&:hover fieldset': {
            border: 'none',
          },
          '&.Mui-focused fieldset': {
            border: 'none',
          },
        },
        pr: { sm: 1 },
        borderRadius: { sm: 1.5 },
        cursor: { sm: 'pointer' },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search fontSize="small" />
          </InputAdornment>
        ),
      }}
    />
  );
}
