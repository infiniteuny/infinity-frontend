import {
  Autocomplete,
  Box,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CommunityGroupAdminMemberInput } from './community-group-admin-member-form';
import { CommunityGroupDto, CommunityGroupMapper } from '@infiniteuny/infinity-infrastructure/dtos';
import { Controller, UseFormReturn } from 'react-hook-form';
import { FileDropzoneField } from '@app/presentation/components/internal/shared';
import { GetUsers } from '@infiniteuny/infinity-application';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { useEffect, useMemo, useState } from 'react';
import { User } from '@infiniteuny/infinity-domain';

type Props = {
  methods: UseFormReturn<CommunityGroupAdminMemberInput>;
  communityGroups: CommunityGroupDto[];
};

export function GeneralForm({
  methods: {
    control,
    formState: { isSubmitting, errors },
  },
  communityGroups,
}: Props) {
  const getUsers = useMemo(() => clientContainer.get<GetUsers>(SYMBOLS.GetUsers), []);
  const parsedCommunityGroups = useMemo(
    () => communityGroups.map(CommunityGroupMapper.fromDtoToDomain),
    [communityGroups],
  );

  const [userInput, setUserInput] = useState('');
  const [userOptions, setUserOptions] = useState<User[]>([]);
  const [isUserLoading, setIsUserLoading] = useState(false);

  useEffect(() => {
    const query = userInput.trim();

    if (query.length < 1) {
      return;
    }

    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      setIsUserLoading(true);

      const usersResult = await getUsers.execute(
        undefined,
        { name: query },
        undefined,
        { perPage: 100 },
        controller.signal,
      );

      if (controller.signal.aborted) return;

      match(usersResult, {
        onLeft: () => {
          setUserOptions([]);
        },
        onRight: ([users]) => {
          setUserOptions(users);
        },
      });

      setIsUserLoading(false);
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [getUsers, userInput]);

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
              name="userId"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={userOptions}
                  value={userOptions.find((user) => user.id === field.value) ?? null}
                  onChange={(_, user) => {
                    field.onChange(user?.id ?? '');
                  }}
                  inputValue={userInput}
                  onInputChange={(_, value) => {
                    setUserInput(value);

                    if (value.trim().length < 1) {
                      setUserOptions([]);
                      setIsUserLoading(false);
                    }
                  }}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  loading={isUserLoading}
                  noOptionsText={userInput ? 'No users found' : 'Type to search user'}
                  disabled={isSubmitting}
                  filterOptions={(options) => options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="userId"
                      label="Name"
                      fullWidth
                      margin="none"
                      helperText={errors.userId?.message}
                      error={!!errors.userId}
                      disabled={isSubmitting}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid size={12}>
            <FormControl fullWidth margin="none" disabled={isSubmitting}>
              <InputLabel id="communityGroupId-label" error={!!errors.communityGroupId}>
                Community Group
              </InputLabel>
              <Controller
                name="communityGroupId"
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="communityGroupId-label"
                    label="Community Group"
                    error={!!errors.communityGroupId}
                  >
                    <MenuItem key="0" value="0" disabled sx={{ display: 'none' }}>
                      Select community group
                    </MenuItem>
                    {parsedCommunityGroups.map((communityGroup) => (
                      <MenuItem key={communityGroup.id} value={communityGroup.id}>
                        {communityGroup.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText error={!!errors.communityGroupId}>
                {errors.communityGroupId?.message}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={12}>
            <FileDropzoneField
              name="photo"
              control={control}
              id="photo"
              label="Photo"
              accept="image/png,image/jpeg,image/webp"
              helperText="Allowed file types: PNG, JPEG, or WebP. Allowed size: up to 5MB."
              isSubmitting={isSubmitting}
              errorMessage={errors.photo?.message}
              previewType="image"
              previewAlt="Selected photo preview"
              currentFileLabel="Current photo"
            />
          </Grid>
          <Grid size={12}>
            <FileDropzoneField
              name="animation"
              control={control}
              id="animation"
              label="Animation"
              accept="image/gif,image/apng,image/webp"
              helperText="Allowed file types: GIF, APNG, or WebP. Allowed size: up to 5MB."
              isSubmitting={isSubmitting}
              errorMessage={errors.animation?.message}
              previewType="image"
              previewAlt="Selected animation preview"
              currentFileLabel="Current animation"
              nullable
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
