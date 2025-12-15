import { z } from 'zod';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Group } from '@mui/icons-material';
import {
  Chip,
  Grid,
  Dialog,
  Button,
  TextField,
  DialogTitle,
  FormControl,
  Autocomplete,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';

import { useAllUsers } from 'src/modules/users/hooks/useAllUsers';

const assignAgentsSchema = z.object({
  agentes: z.array(z.number()),
});

type AssignAgentsFormData = z.infer<typeof assignAgentsSchema>;

interface AssignAgentsDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AssignAgentsFormData) => void;
  initialValues: AssignAgentsFormData;
  title?: string;
  isEditing?: boolean;
}

const AssignAgentsDialog = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  title = 'Asignar Agentes',
  isEditing = false,
}: AssignAgentsDialogProps) => {
  const { users } = useAllUsers();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AssignAgentsFormData>({
    resolver: zodResolver(assignAgentsSchema),
    defaultValues: initialValues,
  });

  const agentes = watch('agentes');

  useEffect(() => {
    if (open) {
      reset({ agentes: initialValues.agentes });
    }
  }, [open, initialValues, reset]);

  const handleFormSubmit = (values: AssignAgentsFormData) => {
    if (!isEditing && (!values.agentes || values.agentes.length === 0)) {
      return;
    }
    onSubmit(values);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Controller
                name="agentes"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors.agentes} fullWidth>
                    <Autocomplete
                      {...field}
                      multiple
                      disableCloseOnSelect
                      options={users || []}
                      getOptionLabel={(option) => {
                        if (!option) return '';
                        if (typeof option === 'number') {
                          return users?.find((u) => u.id === option)?.username || '';
                        }
                        return option.username || '';
                      }}
                      value={users?.filter((user) => field.value?.includes(user.id)) || []}
                      onChange={(_, newValue) => {
                        field.onChange(newValue.map((item) => item.id));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Agentes"
                          error={!!errors.agentes}
                          helperText={
                            !isEditing && (!field.value || field.value.length === 0)
                              ? 'Debe seleccionar al menos un agente'
                              : errors.agentes?.message
                          }
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start">
                                  <Group />
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => (
                          <Chip
                            label={option?.username}
                            {...getTagProps({ index })}
                            onMouseDown={(event) => event.stopPropagation()}
                          />
                        ))
                      }
                    />
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose} color="error">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isEditing && (!agentes || agentes.length === 0)}
          >
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AssignAgentsDialog;
