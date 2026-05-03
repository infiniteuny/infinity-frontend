'use client';

import { GroupPermissionInput } from './group-permission-form';
import { Autocomplete, Box, Container, Grid, TextField, Toolbar, Typography } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { Controller, UseFormReturn } from 'react-hook-form';
import { GetPermissions } from '@app/application';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { Permission } from '@app/domain/entities';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  methods: UseFormReturn<GroupPermissionInput>;
};

export function GeneralForm({
  methods: {
    control,
    formState: { isSubmitting, errors },
  },
}: Props) {
  const getPermissions = useMemo(
    () => clientContainer.get<GetPermissions>(SYMBOLS.GetPermissions),
    [],
  );

  const [permissionInput, setPermissionInput] = useState('');
  const [permissionOptions, setPermissionOptions] = useState<Permission[]>([]);
  const [isPermissionLoading, setIsPermissionLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const query = permissionInput.trim();

    if (query.length < 1) {
      return () => {
        active = false;
      };
    }

    const timeoutId = setTimeout(async () => {
      setIsPermissionLoading(true);

      const permissionsResult = await getPermissions.execute({ name: query }, { perPage: 100 });

      if (!active) return;

      match(permissionsResult, {
        onLeft: () => {
          setPermissionOptions([]);
        },
        onRight: ([permissions]) => {
          setPermissionOptions(permissions);
        },
      });

      setIsPermissionLoading(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [getPermissions, permissionInput]);

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
              name="permissionId"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={permissionOptions}
                  value={permissionOptions.find((p) => p.id === field.value) ?? null}
                  onChange={(_, permission) => {
                    field.onChange(permission?.id ?? '');
                  }}
                  inputValue={permissionInput}
                  onInputChange={(_, value) => {
                    setPermissionInput(value);

                    if (value.trim().length < 1) {
                      setPermissionOptions([]);
                      setIsPermissionLoading(false);
                    }
                  }}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  loading={isPermissionLoading}
                  noOptionsText={
                    permissionInput ? 'No permissions found' : 'Type to search permission'
                  }
                  disabled={isSubmitting}
                  filterOptions={(options) => options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="permissionId"
                      label="Permission"
                      fullWidth
                      margin="none"
                      helperText={errors.permissionId?.message}
                      error={!!errors.permissionId}
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
