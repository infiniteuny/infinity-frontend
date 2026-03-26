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
import { ChangeEvent, useRef, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { FundApplicationInput } from './fund-application-form';
import { formatBytes } from '@app/utils';
import { visuallyHidden } from '@mui/utils';

type Props = {
  methods: UseFormReturn<FundApplicationInput>;
};

export function DocumentsForm({
  methods: {
    control,
    formState: { isSubmitting, errors },
  },
}: Props) {
  const letterInputRef = useRef<HTMLInputElement | null>(null);
  const proposalInputRef = useRef<HTMLInputElement | null>(null);
  const [isDraggingLetter, setIsDraggingLetter] = useState(false);
  const [isDraggingProposal, setIsDraggingProposal] = useState(false);

  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container
        maxWidth={false}
        sx={{ bgcolor: 'surface.main' }}
        className="w-full rounded-2xl p-4"
      >
        <Toolbar component="header" className="mb-4 h-auto min-h-10 p-0">
          <Typography component="h2" variant="h6" className="font-medium">
            Documents
          </Typography>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid size={12}>
            <FormControl fullWidth margin="none" disabled={isSubmitting}>
              <FormLabel
                component="label"
                htmlFor="letter-of-acceptance"
                error={!!errors.letterOfAcceptance}
              >
                Letter of Acceptance
              </FormLabel>
              <Controller
                name="letterOfAcceptance"
                control={control}
                render={({ field: { value, ref, onChange, ...field } }) => (
                  <>
                    <Box
                      role="button"
                      tabIndex={0}
                      onClick={() => letterInputRef.current?.click()}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          letterInputRef.current?.click();
                        }
                      }}
                      onDragEnter={(event) => {
                        event.preventDefault();
                        setIsDraggingLetter(true);
                      }}
                      onDragLeave={(event) => {
                        event.preventDefault();
                        setIsDraggingLetter(false);
                      }}
                      onDragOver={(event) => {
                        event.preventDefault();
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        setIsDraggingLetter(false);

                        const file = event.dataTransfer.files?.[0];
                        if (file) {
                          onChange(file);
                        }
                      }}
                      sx={(theme) => ({
                        border: '1px dashed',
                        borderColor: isDraggingLetter
                          ? theme.vars?.palette.primary.main
                          : errors.letterOfAcceptance
                            ? theme.vars?.palette.error.main
                            : theme.vars?.palette.outline,
                        borderRadius: 1,
                        px: 3,
                        py: 4,
                        bgcolor: isDraggingLetter ? 'primaryContainer.main' : 'transparent',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.7 : 1,
                        transition: theme.transitions.create(['border-color', 'background-color']),
                      })}
                      className="mt-2 flex flex-col items-center gap-1 text-center"
                    >
                      <AttachFileRounded
                        fontSize="large"
                        sx={(theme) => ({
                          color: isDraggingLetter
                            ? theme.vars?.palette.onSurfaceVariant.main
                            : errors.letterOfAcceptance
                              ? theme.vars?.palette.error.main
                              : theme.vars?.palette.onSurfaceVariant.main,
                        })}
                        className="pointer-events-none"
                      />
                      <Typography
                        variant="body1"
                        sx={(theme) => ({
                          color: isDraggingLetter
                            ? theme.vars?.palette.onSurfaceVariant.main
                            : errors.letterOfAcceptance
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
                            color: isDraggingLetter
                              ? theme.vars?.palette.primary.main
                              : errors.letterOfAcceptance
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
                          color: isDraggingLetter
                            ? theme.vars?.palette.onSurfaceVariant.main
                            : errors.letterOfAcceptance
                              ? theme.vars?.palette.error.main
                              : theme.vars?.palette.onSurfaceVariant.main,
                        })}
                        className="pointer-events-none"
                      >
                        Allowed file type: PDF. Allowed size: up to 20MB.
                      </Typography>
                      <Input
                        {...field}
                        id="letter-of-acceptance"
                        type="file"
                        inputProps={{
                          accept: 'application/pdf',
                        }}
                        inputRef={(element) => {
                          ref(element);
                          letterInputRef.current = element;
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
                    {value ? (
                      <Box
                        sx={{
                          width: '100%',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'outline',
                        }}
                        className="mt-4 p-4"
                      >
                        <Box className="flex flex-row items-center justify-between gap-2">
                          <Box>
                            <Typography
                              variant="body2"
                              color="onSurfaceVariant.main"
                              className="font-semibold"
                            >
                              {value instanceof File ? value.name : 'Current document'}
                            </Typography>
                            {value instanceof File ? (
                              <Typography variant="body2" color="onSurfaceVariant.main">
                                Size: {formatBytes(value.size)}
                              </Typography>
                            ) : null}
                          </Box>
                          <IconButton disabled={isSubmitting} onClick={() => onChange(null)}>
                            <DeleteRounded />
                          </IconButton>
                        </Box>
                      </Box>
                    ) : null}
                  </>
                )}
              />
              <FormHelperText error={!!errors.letterOfAcceptance}>
                {errors.letterOfAcceptance?.message}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid size={12}>
            <FormControl fullWidth margin="none" disabled={isSubmitting}>
              <FormLabel component="label" htmlFor="proposal" error={!!errors.proposal}>
                Proposal
              </FormLabel>
              <Controller
                name="proposal"
                control={control}
                render={({ field: { value, ref, onChange, ...field } }) => (
                  <>
                    <Box
                      role="button"
                      tabIndex={0}
                      onClick={() => proposalInputRef.current?.click()}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          proposalInputRef.current?.click();
                        }
                      }}
                      onDragEnter={(event) => {
                        event.preventDefault();
                        setIsDraggingProposal(true);
                      }}
                      onDragLeave={(event) => {
                        event.preventDefault();
                        setIsDraggingProposal(false);
                      }}
                      onDragOver={(event) => {
                        event.preventDefault();
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        setIsDraggingProposal(false);

                        const file = event.dataTransfer.files?.[0];
                        if (file) {
                          onChange(file);
                        }
                      }}
                      sx={(theme) => ({
                        border: '1px dashed',
                        borderColor: isDraggingProposal
                          ? theme.vars?.palette.primary.main
                          : errors.proposal
                            ? theme.vars?.palette.error.main
                            : theme.vars?.palette.outline,
                        borderRadius: 1,
                        px: 3,
                        py: 4,
                        bgcolor: isDraggingProposal ? 'primaryContainer.main' : 'transparent',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.7 : 1,
                        transition: theme.transitions.create(['border-color', 'background-color']),
                      })}
                      className="mt-2 flex flex-col items-center gap-1 text-center"
                    >
                      <AttachFileRounded
                        fontSize="large"
                        sx={(theme) => ({
                          color: isDraggingProposal
                            ? theme.vars?.palette.onSurfaceVariant.main
                            : errors.proposal
                              ? theme.vars?.palette.error.main
                              : theme.vars?.palette.onSurfaceVariant.main,
                        })}
                        className="pointer-events-none"
                      />
                      <Typography
                        variant="body1"
                        sx={(theme) => ({
                          color: isDraggingProposal
                            ? theme.vars?.palette.onSurfaceVariant.main
                            : errors.proposal
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
                            color: isDraggingProposal
                              ? theme.vars?.palette.primary.main
                              : errors.proposal
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
                          color: isDraggingProposal
                            ? theme.vars?.palette.onSurfaceVariant.main
                            : errors.proposal
                              ? theme.vars?.palette.error.main
                              : theme.vars?.palette.onSurfaceVariant.main,
                        })}
                        className="pointer-events-none"
                      >
                        Allowed file type: PDF. Allowed size: up to 20MB.
                      </Typography>
                      <Input
                        {...field}
                        id="proposal"
                        type="file"
                        inputProps={{
                          accept: 'application/pdf',
                        }}
                        inputRef={(element) => {
                          ref(element);
                          proposalInputRef.current = element;
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
                    {value ? (
                      <Box
                        sx={{
                          width: '100%',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'outline',
                        }}
                        className="mt-4 p-4"
                      >
                        <Box className="flex flex-row items-center justify-between gap-2">
                          <Box>
                            <Typography
                              variant="body2"
                              color="onSurfaceVariant.main"
                              className="font-semibold"
                            >
                              {value instanceof File ? value.name : 'Current document'}
                            </Typography>
                            {value instanceof File ? (
                              <Typography variant="body2" color="onSurfaceVariant.main">
                                Size: {formatBytes(value.size)}
                              </Typography>
                            ) : null}
                          </Box>
                          <IconButton disabled={isSubmitting} onClick={() => onChange(null)}>
                            <DeleteRounded />
                          </IconButton>
                        </Box>
                      </Box>
                    ) : null}
                  </>
                )}
              />
              <FormHelperText error={!!errors.proposal}>{errors.proposal?.message}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
