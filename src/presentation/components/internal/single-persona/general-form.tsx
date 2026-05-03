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
import { PersonaInput } from './persona-form';
import { visuallyHidden } from '@mui/utils';

type Props = {
  methods: UseFormReturn<PersonaInput>;
};

export function GeneralForm({
  methods: {
    register,
    control,
    watch,
    formState: { isSubmitting, errors },
  },
}: Props) {
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const selectedLogo = watch('logo');

  useEffect(() => {
    if (selectedLogo instanceof File) {
      const objectUrl = URL.createObjectURL(selectedLogo);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    if (typeof selectedLogo === 'string' && selectedLogo.trim().length > 0) {
      setPreviewUrl(selectedLogo);

      return;
    }

    setPreviewUrl(null);
  }, [selectedLogo]);

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
              {...register('description')}
              id="description"
              label="Description"
              fullWidth
              margin="none"
              multiline
              minRows={4}
              helperText={errors.description?.message}
              error={!!errors.description}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              {...register('priority', { valueAsNumber: true })}
              id="priority"
              label="Priority"
              type="number"
              fullWidth
              margin="none"
              helperText={errors.priority?.message}
              error={!!errors.priority}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid size={12}>
            <FormControl fullWidth margin="none" disabled={isSubmitting}>
              <FormLabel component="label" htmlFor="logo" error={!!errors.logo} className="px-3">
                Logo
              </FormLabel>
              <Controller
                name="logo"
                control={control}
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({ field: { value, ref, onChange, ...field } }) => (
                  <>
                    <Box
                      role="button"
                      tabIndex={0}
                      onClick={() => logoInputRef.current?.click()}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          logoInputRef.current?.click();
                        }
                      }}
                      onDragEnter={(event) => {
                        event.preventDefault();
                        setIsDraggingLogo(true);
                      }}
                      onDragLeave={(event) => {
                        event.preventDefault();
                        setIsDraggingLogo(false);
                      }}
                      onDragOver={(event) => {
                        event.preventDefault();
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        setIsDraggingLogo(false);

                        const file = event.dataTransfer.files?.[0];
                        if (file) {
                          onChange(file);
                        }
                      }}
                      sx={(theme) => ({
                        border: '1px dashed',
                        borderColor: isDraggingLogo
                          ? theme.vars?.palette.primary.main
                          : errors.logo
                            ? theme.vars?.palette.error.main
                            : theme.vars?.palette.outline,
                        borderRadius: 1,
                        px: 3,
                        py: 4,
                        bgcolor: isDraggingLogo ? 'primaryContainer.main' : 'transparent',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.7 : 1,
                        transition: theme.transitions.create(['border-color', 'background-color']),
                      })}
                      className="mt-2 flex flex-col items-center gap-1 text-center"
                    >
                      <AttachFileRounded
                        fontSize="large"
                        sx={(theme) => ({
                          color: isDraggingLogo
                            ? theme.vars?.palette.onSurfaceVariant.main
                            : errors.logo
                              ? theme.vars?.palette.error.main
                              : theme.vars?.palette.onSurfaceVariant.main,
                        })}
                        className="pointer-events-none"
                      />
                      <Typography
                        variant="body1"
                        sx={(theme) => ({
                          color: isDraggingLogo
                            ? theme.vars?.palette.onSurfaceVariant.main
                            : errors.logo
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
                            color: isDraggingLogo
                              ? theme.vars?.palette.primary.main
                              : errors.logo
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
                          color: isDraggingLogo
                            ? theme.vars?.palette.onSurfaceVariant.main
                            : errors.logo
                              ? theme.vars?.palette.error.main
                              : theme.vars?.palette.onSurfaceVariant.main,
                        })}
                        className="pointer-events-none"
                      >
                        Allowed file types: PNG, JPEG, or WebP. Allowed size: up to 5MB.
                      </Typography>
                      <Input
                        {...field}
                        id="logo"
                        type="file"
                        inputProps={{
                          accept: 'image/png,image/jpeg,image/webp',
                        }}
                        inputRef={(element) => {
                          ref(element);
                          logoInputRef.current = element;
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
                          alt="Selected logo preview"
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
                              {selectedLogo instanceof File ? selectedLogo.name : 'Current logo'}
                            </Typography>
                            {selectedLogo instanceof File ? (
                              <Typography variant="body2" color="onSurfaceVariant.main">
                                Size: {formatBytes(selectedLogo.size)}
                              </Typography>
                            ) : null}
                          </Box>
                          <IconButton
                            disabled={isSubmitting}
                            onClick={() => {
                              if (logoInputRef.current) {
                                logoInputRef.current.value = '';
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
              <FormHelperText error={!!errors.logo}>{errors.logo?.message}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
