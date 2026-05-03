import { UserCommunityGroupInput } from './user-community-group-form';
import { Autocomplete, Box, Container, Grid, TextField, Toolbar, Typography } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { Controller, UseFormReturn } from 'react-hook-form';
import { GetCommunityGroups } from '@app/application';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { CommunityGroup } from '@app/domain/entities';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  methods: UseFormReturn<UserCommunityGroupInput>;
};

export function GeneralForm({
  methods: {
    control,
    formState: { isSubmitting, errors },
  },
}: Props) {
  const getCommunityGroups = useMemo(
    () => clientContainer.get<GetCommunityGroups>(SYMBOLS.GetCommunityGroups),
    [],
  );

  const [communityGroupInput, setCommunityGroupInput] = useState('');
  const [communityGroupOptions, setCommunityGroupOptions] = useState<CommunityGroup[]>([]);
  const [isCommunityGroupLoading, setIsCommunityGroupLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const query = communityGroupInput.trim();

    if (query.length < 1) {
      return () => {
        active = false;
      };
    }

    const timeoutId = setTimeout(async () => {
      setIsCommunityGroupLoading(true);

      const communityGroupsResult = await getCommunityGroups.execute(
        { name: query },
        { perPage: 100 },
      );

      if (!active) return;

      match(communityGroupsResult, {
        onLeft: () => {
          setCommunityGroupOptions([]);
        },
        onRight: ([communityGroups]) => {
          setCommunityGroupOptions(communityGroups);
        },
      });

      setIsCommunityGroupLoading(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [getCommunityGroups, communityGroupInput]);

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
              name="communityGroupId"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={communityGroupOptions}
                  value={communityGroupOptions.find((group) => group.id === field.value) ?? null}
                  onChange={(_, group) => {
                    field.onChange(group?.id ?? '');
                  }}
                  inputValue={communityGroupInput}
                  onInputChange={(_, value) => {
                    setCommunityGroupInput(value);

                    if (value.trim().length < 1) {
                      setCommunityGroupOptions([]);
                      setIsCommunityGroupLoading(false);
                    }
                  }}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  loading={isCommunityGroupLoading}
                  noOptionsText={
                    communityGroupInput
                      ? 'No community groups found'
                      : 'Type to search community group'
                  }
                  disabled={isSubmitting}
                  filterOptions={(options) => options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="communityGroupId"
                      label="Community Group"
                      fullWidth
                      margin="none"
                      helperText={errors.communityGroupId?.message}
                      error={!!errors.communityGroupId}
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
