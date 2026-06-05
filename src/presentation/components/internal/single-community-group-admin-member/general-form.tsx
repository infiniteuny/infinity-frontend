import { AttachFileRounded, DeleteRounded } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { clientContainer } from '@app/client-injection';
import { Controller, UseFormReturn } from 'react-hook-form';
import { CommunityGroupDto, CommunityGroupMapper } from '@app/infrastructure/dtos';
import { CommunityGroupAdminMemberInput } from './community-group-admin-member-form';
import { formatBytes } from '@app/utils';
import { GetUsers } from '@app/application';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { User } from '@app/domain/entities';
import { visuallyHidden } from '@mui/utils';

type Props = {
  methods: UseFormReturn<CommunityGroupAdminMemberInput>;
  communityGroups: CommunityGroupDto[];
};

export function GeneralForm({
  methods: {
    control,
    watch,
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

  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const selectedPhoto = watch('photo');

  const animationInputRef = useRef<HTMLInputElement | null>(null);
  const [isDraggingAnimation, setIsDraggingAnimation] = useState(false);
  const [animationPreviewUrl, setAnimationPreviewUrl] = useState<string | null>(null);
  const selectedAnimation = watch('animation');

  useEffect(() => {
    let active = true;
    const query = userInput.trim();

    if (query.length < 1) {
      return () => {
        active = false;
      };
    }

    const timeoutId = setTimeout(async () => {
      setIsUserLoading(true);

      const usersResult = await getUsers.execute(undefined, { name: query }, undefined, {
        perPage: 100,
      });

      if (!active) return;

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
      active = false;
      clearTimeout(timeoutId);
    };
  }, [getUsers, userInput]);

  useEffect(() => {
    if (selectedPhoto instanceof File) {
      const objectUrl = URL.createObjectURL(selectedPhoto);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhotoPreviewUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    if (typeof selectedPhoto === 'string' && selectedPhoto.trim().length > 0) {
      setPhotoPreviewUrl(selectedPhoto);

      return;
    }

    setPhotoPreviewUrl(null);
  }, [selectedPhoto]);

  useEffect(() => {
    if (selectedAnimation instanceof File) {
      const objectUrl = URL.createObjectURL(selectedAnimation);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimationPreviewUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    if (typeof selectedAnimation === 'string' && selectedAnimation.trim().length > 0) {
      setAnimationPreviewUrl(selectedAnimation);

      return;
    }

    setAnimationPreviewUrl(null);
  }, [selectedAnimation]);

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
            <FormControl fullWidth margin="none" disabled={isSubmitting}>
              <FormLabel component="label" htmlFor="photo" error={!!errors.photo} className="px-3">
                Photo
              </FormLabel>
              <Controller
                name="photo"
                control={control}
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({ field: { value, ref, onChange, ...field } }) => (
                  <>
                    <Box
                      role="button"
                      tabIndex={0}
                      onClick={() => photoInputRef.current?.click()}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          photoInputRef.current?.click();
                        }
                      }}
                      onDragEnter={(event) => {
                        event.preventDefault();
                        setIsDraggingPhoto(true);
                      }}
                      onDragLeave={(event) => {
                        event.preventDefault();
                        setIsDraggingPhoto(false);
                      }}
                      onDragOver={(event) => {
                        event.preventDefault();
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        setIsDraggingPhoto(false);

                        const file = event.dataTransfer.files?.[0];
                        if (file) {
                          onChange(file);
                        }
                      }}
                      sx={(theme) => ({
                        border: '1px dashed',
                        borderColor: isDraggingPhoto
                          ? theme.vars?.palette.primary.main
                          : errors.photo
                            ? theme.vars?.palette.error.main
                            : theme.vars?.palette.outline,
                        borderRadius: 1,
                        px: 3,
                        py: 4,
                        bgcolor: isDraggingPhoto ? 'primaryContainer.main' : 'transparent',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.7 : 1,
                        transition: theme.transitions.create(['border-color', 'background-color']),
                      })}
                      className="mt-2 flex flex-col items-center gap-1 text-center"
                    >
                      <AttachFileRounded
                        fontSize="large"
                        sx={(theme) => ({
                          color: isDraggingPhoto
                            ? theme.vars?.palette.onSurfaceVariant.main
                            : errors.photo
                              ? theme.vars?.palette.error.main
                              : theme.vars?.palette.onSurfaceVariant.main,
                        })}
                        className="pointer-events-none"
                      />
                      <Typography
                        variant="body1"
                        sx={(theme) => ({
                          color: isDraggingPhoto
                            ? theme.vars?.palette.onSurfaceVariant.main
                            : errors.photo
                              ? theme.vars?.palette.error.main
                              : theme.vars?.palette.onSurfaceVariant.main,
                        })}
                        className="pointer-events-none mt-2"
                      >
                        Drag and drop or
                        <Typography
                          component="span"
                          variant="body1"
                          sx={(theme) => ({
                            color: isDraggingPhoto
                              ? theme.vars?.palette.primary.main
                              : errors.photo
                                ? theme.vars?.palette.error.main
                                : theme.vars?.palette.primary.main,
                          })}
                          className="pointer-events-none font-semibold"
                        >
                          {' '}
                          click{' '}
                        </Typography>
                        to browse
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={(theme) => ({
                          color: isDraggingPhoto
                            ? theme.vars?.palette.onSurfaceVariant.main
                            : errors.photo
                              ? theme.vars?.palette.error.main
                              : theme.vars?.palette.onSurfaceVariant.main,
                        })}
                        className="pointer-events-none"
                      >
                        Allowed file types: PNG, JPEG, or WebP. Allowed size: up to 5MB.
                      </Typography>
                      <Input
                        {...field}
                        id="photo"
                        type="file"
                        inputProps={{
                          accept: 'image/png,image/jpeg,image/webp',
                        }}
                        inputRef={(element) => {
                          ref(element);
                          photoInputRef.current = element;
                        }}
                        disabled={isSubmitting}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          const file = event.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                        sx={visuallyHidden}
                        className="pointer-events-none"
                      />
                    </Box>
                    {photoPreviewUrl ? (
                      <Box
                        sx={{
                          width: '100%',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'outline',
                        }}
                        className="mt-4 p-2"
                      >
                        <Box
                          component="img"
                          src={photoPreviewUrl}
                          alt="Selected photo preview"
                          sx={{
                            width: '100%',
                            maxHeight: 280,
                            objectFit: 'contain',
                          }}
                        />
                        <Box className="mt-2 flex flex-row items-center justify-between gap-2 p-4">
                          <Box>
                            <Typography
                              variant="body2"
                              color="onSurfaceVariant.main"
                              className="font-semibold"
                            >
                              {selectedPhoto instanceof File ? selectedPhoto.name : 'Current photo'}
                            </Typography>
                            {selectedPhoto instanceof File ? (
                              <Typography variant="body2" color="onSurfaceVariant.main">
                                Size: {formatBytes(selectedPhoto.size)}
                              </Typography>
                            ) : null}
                          </Box>
                          <IconButton
                            disabled={isSubmitting}
                            onClick={() => {
                              if (photoInputRef.current) {
                                photoInputRef.current.value = '';
                              }
                              onChange(null);
                            }}
                          >
                            <DeleteRounded />
                          </IconButton>
                        </Box>
                      </Box>
                    ) : null}
                  </>
                )}
              />
              <FormHelperText error={!!errors.photo}>{errors.photo?.message}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={12}>
            <FormControl fullWidth margin="none" disabled={isSubmitting}>
              <FormLabel
                component="label"
                htmlFor="animation"
                error={!!errors.animation}
                className="px-3"
              >
                Animation
              </FormLabel>
              <Controller
                name="animation"
                control={control}
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({ field: { value, ref, onChange, ...field } }) => (
                  <>
                    <Box
                      role="button"
                      tabIndex={0}
                      onClick={() => animationInputRef.current?.click()}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          animationInputRef.current?.click();
                        }
                      }}
                      onDragEnter={(event) => {
                        event.preventDefault();
                        setIsDraggingAnimation(true);
                      }}
                      onDragLeave={(event) => {
                        event.preventDefault();
                        setIsDraggingAnimation(false);
                      }}
                      onDragOver={(event) => {
                        event.preventDefault();
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        setIsDraggingAnimation(false);

                        const file = event.dataTransfer.files?.[0];
                        if (file) {
                          onChange(file);
                        }
                      }}
                      sx={(theme) => ({
                        border: '1px dashed',
                        borderColor: isDraggingAnimation
                          ? theme.vars?.palette.primary.main
                          : errors.animation
                            ? theme.vars?.palette.error.main
                            : theme.vars?.palette.outline,
                        borderRadius: 1,
                        px: 3,
                        py: 4,
                        bgcolor: isDraggingAnimation ? 'primaryContainer.main' : 'transparent',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.7 : 1,
                        transition: theme.transitions.create(['border-color', 'background-color']),
                      })}
                      className="mt-2 flex flex-col items-center gap-1 text-center"
                    >
                      <AttachFileRounded
                        fontSize="large"
                        sx={(theme) => ({
                          color: isDraggingAnimation
                            ? theme.vars?.palette.onSurfaceVariant.main
                            : errors.animation
                              ? theme.vars?.palette.error.main
                              : theme.vars?.palette.onSurfaceVariant.main,
                        })}
                        className="pointer-events-none"
                      />
                      <Typography
                        variant="body1"
                        sx={(theme) => ({
                          color: isDraggingAnimation
                            ? theme.vars?.palette.onSurfaceVariant.main
                            : errors.animation
                              ? theme.vars?.palette.error.main
                              : theme.vars?.palette.onSurfaceVariant.main,
                        })}
                        className="pointer-events-none mt-2"
                      >
                        Drag and drop or
                        <Typography
                          component="span"
                          variant="body1"
                          sx={(theme) => ({
                            color: isDraggingAnimation
                              ? theme.vars?.palette.primary.main
                              : errors.animation
                                ? theme.vars?.palette.error.main
                                : theme.vars?.palette.primary.main,
                          })}
                          className="pointer-events-none font-semibold"
                        >
                          {' '}
                          click{' '}
                        </Typography>
                        to browse
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={(theme) => ({
                          color: isDraggingAnimation
                            ? theme.vars?.palette.onSurfaceVariant.main
                            : errors.animation
                              ? theme.vars?.palette.error.main
                              : theme.vars?.palette.onSurfaceVariant.main,
                        })}
                        className="pointer-events-none"
                      >
                        Allowed file types: GIF, APNG, or WebP. Allowed size: up to 5MB.
                      </Typography>
                      <Input
                        {...field}
                        id="animation"
                        type="file"
                        inputProps={{
                          accept: 'image/gif,image/apng,image/webp',
                        }}
                        inputRef={(element) => {
                          ref(element);
                          animationInputRef.current = element;
                        }}
                        disabled={isSubmitting}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          const file = event.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                        sx={visuallyHidden}
                        className="pointer-events-none"
                      />
                    </Box>
                    {animationPreviewUrl ? (
                      <Box
                        sx={{
                          width: '100%',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'outline',
                        }}
                        className="mt-4 p-2"
                      >
                        <Box
                          component="img"
                          src={animationPreviewUrl}
                          alt="Selected animation preview"
                          sx={{
                            width: '100%',
                            maxHeight: 280,
                            objectFit: 'contain',
                          }}
                        />
                        <Box className="mt-2 flex flex-row items-center justify-between gap-2 p-4">
                          <Box>
                            <Typography
                              variant="body2"
                              color="onSurfaceVariant.main"
                              className="font-semibold"
                            >
                              {selectedAnimation instanceof File
                                ? selectedAnimation.name
                                : 'Current animation'}
                            </Typography>
                            {selectedAnimation instanceof File ? (
                              <Typography variant="body2" color="onSurfaceVariant.main">
                                Size: {formatBytes(selectedAnimation.size)}
                              </Typography>
                            ) : null}
                          </Box>
                          <IconButton
                            disabled={isSubmitting}
                            onClick={() => {
                              if (animationInputRef.current) {
                                animationInputRef.current.value = '';
                              }
                              onChange(null);
                            }}
                          >
                            <DeleteRounded />
                          </IconButton>
                        </Box>
                      </Box>
                    ) : null}
                  </>
                )}
              />
              <FormHelperText error={!!errors.animation}>
                {errors.animation?.message}
              </FormHelperText>
            </FormControl>{' '}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
