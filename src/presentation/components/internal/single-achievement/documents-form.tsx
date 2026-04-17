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
  Toolbar,
  Typography,
} from '@mui/material';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { formatBytes } from '@app/utils';
import { AchievementInput } from './achievement-form';
import { visuallyHidden } from '@mui/utils';

type Props = {
  methods: UseFormReturn<AchievementInput>;
};

export function DocumentsForm({
  methods: {
    control,
    watch,
    formState: { isSubmitting, errors },
  },
}: Props) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const selectedImage = watch('image');

  useEffect(() => {
    if (selectedImage instanceof File) {
      const objectUrl = URL.createObjectURL(selectedImage);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    if (typeof selectedImage === 'string' && selectedImage.trim().length > 0) {
      setPreviewUrl(selectedImage);

      return;
    }

    setPreviewUrl(null);
  }, [selectedImage]);

  return (
    <Box component="section" className="mb-6 w-full px-6">
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Toolbar component="header" className="h-auto min-h-10 p-3">
          <Typography component="h2" variant="h6" className="font-medium">
            Documents
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid size={12}>
            <FormControl fullWidth margin="none" disabled={isSubmitting}>
              <FormLabel component="label" htmlFor="image" error={!!errors.image} className="px-3">
                Image
              </FormLabel>
              <Controller
                name="image"
                control={control}
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({ field: { value, ref, onChange, ...field } }) => (
                  <>
                    <Box
                      role="button"
                      tabIndex={0}
                      onClick={() => imageInputRef.current?.click()}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          imageInputRef.current?.click();
                        }
                      }}
                      onDragEnter={(event) => {
                        event.preventDefault();
                        setIsDraggingImage(true);
                      }}
                      onDragLeave={(event) => {
                        event.preventDefault();
                        setIsDraggingImage(false);
                      }}
                      onDragOver={(event) => {
                        event.preventDefault();
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        setIsDraggingImage(false);

                        const file = event.dataTransfer.files?.[0];
                        if (file) {
                          onChange(file);
                        }
                      }}
                      sx={(theme) => ({
                        border: '1px dashed',
                        borderColor: isDraggingImage
                          ? theme.vars?.palette.primary.main
                          : errors.image
                            ? theme.vars?.palette.error.main
                            : theme.vars?.palette.outline,
                        borderRadius: 1,
                        px: 3,
                        py: 4,
                        bgcolor: isDraggingImage ? 'primaryContainer.main' : 'transparent',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.7 : 1,
                        transition: theme.transitions.create(['border-color', 'background-color']),
                      })}
                      className="mt-2 flex flex-col items-center gap-1 text-center"
                    >
                      <AttachFileRounded
                        fontSize="large"
                        sx={(theme) => ({
                          color: isDraggingImage
                            ? theme.vars?.palette.onSurfaceVariant.main
                            : errors.image
                              ? theme.vars?.palette.error.main
                              : theme.vars?.palette.onSurfaceVariant.main,
                        })}
                        className="pointer-events-none"
                      />
                      <Typography
                        variant="body1"
                        sx={(theme) => ({
                          color: isDraggingImage
                            ? theme.vars?.palette.onSurfaceVariant.main
                            : errors.image
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
                            color: isDraggingImage
                              ? theme.vars?.palette.primary.main
                              : errors.image
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
                          color: isDraggingImage
                            ? theme.vars?.palette.onSurfaceVariant.main
                            : errors.image
                              ? theme.vars?.palette.error.main
                              : theme.vars?.palette.onSurfaceVariant.main,
                        })}
                        className="pointer-events-none"
                      >
                        Allowed file types: PNG, JPEG, or WebP. Allowed size: up to 5MB.
                      </Typography>
                      <Input
                        {...field}
                        id="image"
                        type="file"
                        inputProps={{
                          accept: 'image/png,image/jpeg,image/webp',
                        }}
                        inputRef={(element) => {
                          ref(element);
                          imageInputRef.current = element;
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
                          alt="Selected image preview"
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
                              {selectedImage instanceof File ? selectedImage.name : 'Current image'}
                            </Typography>
                            {selectedImage instanceof File ? (
                              <Typography variant="body2" color="onSurfaceVariant.main">
                                Size: {formatBytes(selectedImage.size)}
                              </Typography>
                            ) : null}
                          </Box>
                          <IconButton
                            disabled={isSubmitting}
                            onClick={() => {
                              if (imageInputRef.current) {
                                imageInputRef.current.value = '';
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
              <FormHelperText error={!!errors.image}>{errors.image?.message}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
