import { UserPersonaInput } from './user-persona-form';
import { Autocomplete, Box, Container, Grid, TextField, Toolbar, Typography } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { Controller, UseFormReturn } from 'react-hook-form';
import { GetPersonas } from '@app/application';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { Persona } from '@app/domain/entities';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  methods: UseFormReturn<UserPersonaInput>;
};

export function GeneralForm({
  methods: {
    control,
    formState: { isSubmitting, errors },
  },
}: Props) {
  const getPersonas = useMemo(() => clientContainer.get<GetPersonas>(SYMBOLS.GetPersonas), []);

  const [personaInput, setPersonaInput] = useState('');
  const [personaOptions, setPersonaOptions] = useState<Persona[]>([]);
  const [isPersonaLoading, setIsPersonaLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const query = personaInput.trim();

    if (query.length < 1) {
      return () => {
        active = false;
      };
    }

    const timeoutId = setTimeout(async () => {
      setIsPersonaLoading(true);

      const personasResult = await getPersonas.execute({ name: query }, undefined, {
        perPage: 100,
      });

      if (!active) return;

      match(personasResult, {
        onLeft: () => {
          setPersonaOptions([]);
        },
        onRight: ([personas]) => {
          setPersonaOptions(personas);
        },
      });

      setIsPersonaLoading(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [getPersonas, personaInput]);

  return (
    <Box component="section" className="mb-6 w-full px-6">
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Toolbar component="header" className="h-auto min-h-10 p-3">
          <Typography component="h2" variant="h6" className="font-medium">
            General
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Controller
              name="personaId"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={personaOptions}
                  value={personaOptions.find((p) => p.id === field.value) ?? null}
                  onChange={(_, persona) => {
                    field.onChange(persona?.id ?? '');
                  }}
                  inputValue={personaInput}
                  onInputChange={(_, value) => {
                    setPersonaInput(value);

                    if (value.trim().length < 1) {
                      setPersonaOptions([]);
                      setIsPersonaLoading(false);
                    }
                  }}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  loading={isPersonaLoading}
                  noOptionsText={personaInput ? 'No personas found' : 'Type to search persona'}
                  disabled={isSubmitting}
                  filterOptions={(options) => options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="personaId"
                      label="Persona"
                      fullWidth
                      margin="none"
                      helperText={errors.personaId?.message}
                      error={!!errors.personaId}
                      disabled={isSubmitting}
                    />
                  )}
                />
              )}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
