import { z } from 'zod';
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

import { useUsers } from 'src/modules/users/hooks/useUsers';

const assignAgentsSchema = z.object({
  agentes: z.array(z.number()).min(1, 'Debe seleccionar al menos un agente'),
});

type AssignAgentsFormData = z.infer<typeof assignAgentsSchema>;

interface AssignAgentsDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AssignAgentsFormData) => void;
  initialValues: AssignAgentsFormData;
}

export function AssignAgentsDialog({
  open,
  onClose,
  onSubmit,
  initialValues,
}: AssignAgentsDialogProps) {
  const { data: users } = useUsers();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignAgentsFormData>({
    resolver: zodResolver(assignAgentsSchema),
    defaultValues: initialValues,
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Asignar Agentes</DialogTitle>
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
                      options={users?.results || []}
                      getOptionLabel={(option) => {
                        if (!option) return '';
                        if (typeof option === 'number') {
                          return users?.results.find((u) => u.id === option)?.username || '';
                        }
                        return option.username || '';
                      }}
                      value={
                        field.value?.map((id) => users?.results.find((u) => u.id === id)) || []
                      }
                      onChange={(_, newValue) => {
                        field.onChange(newValue.map((item) => item?.id));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Agentes"
                          error={!!errors.agentes}
                          helperText={errors.agentes?.message}
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
          <Button onClick={onClose} color="error">
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            Asignar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
