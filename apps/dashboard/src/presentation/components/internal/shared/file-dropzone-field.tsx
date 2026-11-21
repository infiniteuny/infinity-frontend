'use client';

import { AttachFileRounded, DeleteRounded } from '@mui/icons-material';
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Typography,
} from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Control, Controller, FieldValues, Path, useWatch } from 'react-hook-form';
import { formatBytes } from '@infiniteuny/infinity-utils';
import { PdfViewer } from './pdf-viewer-dynamic';
import { visuallyHidden } from '@mui/utils';

type Props<TFieldValues extends FieldValues, TName extends Path<TFieldValues>> = {
  name: TName;
  control: Control<TFieldValues>;
  id: string;
  label: string;
  accept: string;
  helperText: string;
  isSubmitting: boolean;
  errorMessage?: string;
  previewType: 'image' | 'pdf' | 'file';
  previewTitle?: string;
  previewAlt?: string;
  currentFileLabel?: string;
  nullable?: boolean;
};

export function FileDropzoneField<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  name,
  control,
  id,
  label,
  accept,
  helperText,
  isSubmitting,
  errorMessage,
  previewType,
  previewTitle,
  previewAlt,
  currentFileLabel,
  nullable = false,
}: Props<TFieldValues, TName>) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewEntry, setPreviewEntry] = useState<{ file: File; url: string } | null>(null);
  const selectedValue = useWatch({ control, name }) as unknown;

  const updateFilePreview = useCallback(
    (file: File | null) => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }

      if (previewType === 'image' && file) {
        const url = URL.createObjectURL(file);
        objectUrlRef.current = url;
        setPreviewEntry({ file, url });
      } else {
        setPreviewEntry(null);
      }
    },
    [previewType],
  );

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  const imagePreviewUrl =
    previewType === 'image'
      ? selectedValue instanceof File
        ? previewEntry?.file === selectedValue
          ? previewEntry.url
          : null
        : typeof selectedValue === 'string' && selectedValue.trim().length > 0
          ? selectedValue
          : null
      : null;

  const hasError = Boolean(errorMessage);
  const fallbackLabel =
    currentFileLabel ?? (previewType === 'image' ? 'Current image' : 'Current document');

  return (
    <FormControl fullWidth margin="none" disabled={isSubmitting}>
      <FormLabel component="label" htmlFor={id} error={hasError} className="px-3">
        {label}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, ref, onChange, ...field } }) => {
          const fileValue = value as File | string | null | undefined;
          const showPreview =
            previewType === 'image' ? Boolean(imagePreviewUrl) : Boolean(fileValue);

          return (
            <>
              <Box
                role="button"
                tabIndex={isSubmitting ? -1 : 0}
                aria-label={`Upload ${label}`}
                aria-disabled={isSubmitting}
                onClick={() => {
                  if (isSubmitting) return;
                  inputRef.current?.click();
                }}
                onKeyDown={(event) => {
                  if (isSubmitting) return;
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    inputRef.current?.click();
                  }
                }}
                onDragEnter={(event) => {
                  event.preventDefault();
                  if (!isSubmitting) setIsDragging(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                  if (isSubmitting) return;

                  const file = event.dataTransfer.files?.[0];
                  if (file) {
                    updateFilePreview(file);
                    onChange(file);
                  }
                }}
                sx={(theme) => ({
                  border: '1px dashed',
                  borderColor: isDragging
                    ? theme.vars?.palette.primary.main
                    : hasError
                      ? theme.vars?.palette.error.main
                      : theme.vars?.palette.outline,
                  borderRadius: 1,
                  px: 3,
                  py: 4,
                  bgcolor: isDragging ? 'primaryContainer.main' : 'transparent',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  transition: theme.transitions.create(['border-color', 'background-color']),
                })}
                className="mt-2 flex flex-col items-center gap-1 text-center"
              >
                <AttachFileRounded
                  fontSize="large"
                  sx={(theme) => ({
                    color: isDragging
                      ? theme.vars?.palette.onSurfaceVariant.main
                      : hasError
                        ? theme.vars?.palette.error.main
                        : theme.vars?.palette.onSurfaceVariant.main,
                  })}
                  className="pointer-events-none"
                />
                <Typography
                  variant="body1"
                  sx={(theme) => ({
                    color: isDragging
                      ? theme.vars?.palette.onSurfaceVariant.main
                      : hasError
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
                      color: isDragging
                        ? theme.vars?.palette.primary.main
                        : hasError
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
                    color: isDragging
                      ? theme.vars?.palette.onSurfaceVariant.main
                      : hasError
                        ? theme.vars?.palette.error.main
                        : theme.vars?.palette.onSurfaceVariant.main,
                  })}
                  className="pointer-events-none"
                >
                  {helperText}
                </Typography>
                <Input
                  {...field}
                  id={id}
                  type="file"
                  inputProps={{ accept }}
                  inputRef={(element) => {
                    ref(element);
                    inputRef.current = element;
                  }}
                  disabled={isSubmitting}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      updateFilePreview(file);
                      onChange(file);
                    }
                  }}
                  sx={visuallyHidden}
                  className="pointer-events-none"
                />
              </Box>
              {showPreview ? (
                <Box
                  sx={{
                    width: '100%',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'outline',
                  }}
                  className={previewType === 'image' ? 'mt-4 p-2' : 'mt-4 p-4'}
                >
                  {previewType === 'image' && imagePreviewUrl ? (
                    <Box
                      component="img"
                      src={imagePreviewUrl}
                      alt={previewAlt ?? `Selected ${label.toLowerCase()} preview`}
                      sx={{
                        width: '100%',
                        maxHeight: 280,
                        objectFit: 'contain',
                      }}
                    />
                  ) : null}
                  {previewType === 'pdf' && fileValue ? (
                    <PdfViewer
                      file={fileValue}
                      title={previewTitle ?? `${label} Preview`}
                      height={500}
                    />
                  ) : null}
                  <Box
                    className={
                      previewType === 'file'
                        ? 'flex flex-row items-center justify-between gap-2'
                        : previewType === 'pdf'
                          ? 'mt-2 flex flex-row items-center justify-between gap-2'
                          : 'mt-2 flex flex-row items-center justify-between gap-2 p-4'
                    }
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        color="onSurfaceVariant.main"
                        className="font-semibold"
                      >
                        {fileValue instanceof File ? fileValue.name : fallbackLabel}
                      </Typography>
                      {fileValue instanceof File ? (
                        <Typography variant="body2" color="onSurfaceVariant.main">
                          Size: {formatBytes(fileValue.size)}
                        </Typography>
                      ) : null}
                    </Box>
                    <IconButton
                      aria-label={`Remove ${label}`}
                      disabled={isSubmitting}
                      onClick={() => {
                        if (inputRef.current) {
                          inputRef.current.value = '';
                        }
                        updateFilePreview(null);
                        onChange(nullable ? null : undefined);
                      }}
                    >
                      <DeleteRounded />
                    </IconButton>
                  </Box>
                </Box>
              ) : null}
            </>
          );
        }}
      />
      <FormHelperText error={hasError}>{errorMessage}</FormHelperText>
    </FormControl>
  );
}
