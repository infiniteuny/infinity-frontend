import { AttachFileRounded, DeleteRounded } from '@mui/icons-material';
import {
  Box,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  Input,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { formatBytes } from '@app/utils';
import { TestimonialInput } from './testimonial-form';
import { visuallyHidden } from '@mui/utils';

type Props = {
  methods: UseFormReturn<TestimonialInput>;
};

export function GeneralForm({
  methods: {
    register,
    control,
    watch,
    formState: { isSubmitting, errors },
  },
}: Props) {
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const selectedPhoto = watch('photo');

  useEffect(() => {
    if (selectedPhoto instanceof File) {
      const objectUrl = URL.createObjectURL(selectedPhoto);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    if (typeof selectedPhoto === 'string' && selectedPhoto.trim().length > 0) {
      setPreviewUrl(selectedPhoto);

      return;
    }

    setPreviewUrl(null);
  }, [selectedPhoto]);

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
            <TextField
              {...register('name')}
              id="name"
              label="Name"
              fullWidth
              margin="none"
              helperText={errors.name?.message}
              error={!!errors.name}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              {...register('position')}
              id="position"
              label="Position"
              fullWidth
              margin="none"
              helperText={errors.position?.message}
              error={!!errors.position}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              {...register('content')}
              id="content"
              label="Content"
              fullWidth
              margin="none"
              multiline
              rows={4}
              helperText={errors.content?.message}
              error={!!errors.content}
              disabled={isSubmitting}
            />
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
                    {previewUrl ? (
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
                          src={previewUrl}
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
        </Grid>
      </Container>
    </Box>
  );
}
