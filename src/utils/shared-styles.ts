'use client';

import type { Theme } from 'src/theme/types';

import { styled, MenuItem } from '@mui/material';

export const buttonStyles = {
  paddingY: 0.9,
  paddingX: 1.6,
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
  fontWeight: 300,
  '&:hover': {
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.30)',
  },
};

export const inputStyles = (theme: Theme) => ({
  '& .MuiInputLabel-root.Mui-focused': {
    color: `${theme.palette.primary.darker} !important`,
  },
  '& .MuiOutlinedInput-root': {
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.10)',
    '&:hover fieldset': {
      borderColor: theme.palette.primary.darker,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.darker,
    },
    '&.Mui-focused .MuiInputBase-input': {
      color: theme.palette.primary.darker,
    },
    '&.Mui-disabled:hover fieldset': {
      borderColor: 'transparent',
    },
  },
  '& .MuiInputBase-root:hover': {
    outline: 'none',
  },
});

export const inputSelectStyles = (theme: Theme, disabled: boolean) => ({
  width: '100%',
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.darker,
  },
  '& .MuiOutlinedInput-root': {
    boxShadow: disabled ? 'none' : '0px 2px 8px rgba(0, 0, 0, 0.10)',
    '&:hover fieldset': {
      borderColor: disabled ? 'transparent' : theme.palette.primary.darker,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.darker,
    },
  },
  '& .MuiSelect-root': {
    '&:focus': {
      borderColor: theme.palette.primary.darker,
    },
  },
  '& .MuiInputBase-root:hover': {
    outline: 'none',
  },
  '& .MuiInput-root': {
    '&.Mui-focused': {
      color: theme.palette.primary.darker,
    },
  },
});

export const menuItemStyles = (theme: Theme) => ({
  '&:hover': {
    backgroundColor: 'rgba(0, 128, 0, 0.1)',
    borderLeft: '2px solid green',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(0, 128, 0, 0.2)',
    '&:hover': {
      backgroundColor: 'rgba(0, 128, 0, 0.25)',
    },
  },
});

export const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.grey[700],
  padding: theme.spacing(0.5, 2),
  '& .MuiListItemIcon-root': {
    minWidth: 36,
    color: theme.palette.grey[700],
  },
  '& .MuiListItemText-primary': {
    fontSize: theme.typography.pxToRem(14),
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));
