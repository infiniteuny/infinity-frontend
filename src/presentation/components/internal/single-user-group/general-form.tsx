import { UserGroupInput } from './user-group-form';
import { Autocomplete, Box, Container, Grid, TextField, Toolbar, Typography } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { Controller, UseFormReturn } from 'react-hook-form';
import { GetGroups } from '@app/application';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { Group } from '@app/domain/entities';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  methods: UseFormReturn<UserGroupInput>;
};

export function GeneralForm({
  methods: {
    control,
    formState: { isSubmitting, errors },
  },
}: Props) {
  const getGroups = useMemo(() => clientContainer.get<GetGroups>(SYMBOLS.GetGroups), []);

  const [groupInput, setGroupInput] = useState('');
  const [groupOptions, setGroupOptions] = useState<Group[]>([]);
  const [isGroupLoading, setIsGroupLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const query = groupInput.trim();

    if (query.length < 1) {
      return () => {
        active = false;
      };
    }

    const timeoutId = setTimeout(async () => {
      setIsGroupLoading(true);

      const groupsResult = await getGroups.execute({ name: query }, { perPage: 100 });

      if (!active) return;

      match(groupsResult, {
        onLeft: () => {
          setGroupOptions([]);
        },
        onRight: ([groups]) => {
          setGroupOptions(groups);
        },
      });

      setIsGroupLoading(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [getGroups, groupInput]);

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
              name="groupId"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={groupOptions}
                  value={groupOptions.find((group) => group.id === field.value) ?? null}
                  onChange={(_, group) => {
                    field.onChange(group?.id ?? '');
                  }}
                  inputValue={groupInput}
                  onInputChange={(_, value) => {
                    setGroupInput(value);

                    if (value.trim().length < 1) {
                      setGroupOptions([]);
                      setIsGroupLoading(false);
                    }
                  }}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  loading={isGroupLoading}
                  noOptionsText={groupInput ? 'No groups found' : 'Type to search group'}
                  disabled={isSubmitting}
                  filterOptions={(options) => options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="groupId"
                      label="Group"
                      fullWidth
                      margin="none"
                      helperText={errors.groupId?.message}
                      error={!!errors.groupId}
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
