'use client';

import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateCompetitionInstance, UpdateCompetitionInstance } from '@app/application';
import { GeneralForm } from './general-form';
import { AttachmentForm } from './attachment-form';
import { match } from 'effect/Either';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import {
  CompetitionDto,
  CompetitionInstanceDto,
  CompetitionInstanceMapper,
  CompetitionMapper,
  CompetitionOrganizerTypeDto,
} from '@app/infrastructure/dtos';
import { CompetitionInstanceToolbar } from './competition-instance-toolbar';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver, useForm, useWatch } from 'react-hook-form';

const competitionInstanceInputSchema = z
  .object({
    competitionId: z.uuidv7('Competition must be selected'),
    name: z.string().min(1, 'Name must not be empty'),
    shortname: z.union([
      z.string().min(2, 'Shortname must be at least 2 characters'),
      z.literal('').nullable(),
    ]),
    description: z.string().min(1, 'Description must not be empty'),
    url: z.union([z.url('URL must be a valid URL'), z.literal('').nullable()]),
    organizer: z.string().min(1, 'Organizer must not be empty'),
    organizerTypeId: z.uuidv7('Organizer type must be selected'),
    logo: z.union([
      z
        .file('Logo must not be empty')
        .mime(['image/png', 'image/jpeg', 'image/webp'], 'Logo must be a PNG, JPEG, or WebP file')
        .max(5120 * 1024, 'Logo must be less than 5MB'),
      z.string(),
    ]),
    startDate: z.date('Start date must be a valid date'),
    endDate: z.date('End date must be a valid date'),
    location: z.string().min(1, 'Location must not be empty'),
  })
  .refine((data) => !data.startDate || !data.endDate || data.startDate <= data.endDate, {
    message: 'Start date must be earlier than or equal to end date.',
    path: ['startDate'],
  })
  .refine((data) => !data.startDate || !data.endDate || data.endDate >= data.startDate, {
    message: 'End date must be later than or equal to start date.',
    path: ['endDate'],
  });

export type CompetitionInstanceInput = z.infer<typeof competitionInstanceInputSchema>;

type Props = {
  competition: CompetitionDto;
  initialCompetitionInstance?: CompetitionInstanceDto;
  competitionOrganizerTypes: CompetitionOrganizerTypeDto[];
};

export function CompetitionInstanceForm({
  competition,
  initialCompetitionInstance,
  competitionOrganizerTypes,
}: Props) {
  const createCompetitionInstance = useMemo(
    () => clientContainer.get<CreateCompetitionInstance>(SYMBOLS.CreateCompetitionInstance),
    [],
  );
  const updateCompetitionInstance = useMemo(
    () => clientContainer.get<UpdateCompetitionInstance>(SYMBOLS.UpdateCompetitionInstance),
    [],
  );
  const parsedCompetition = useMemo(
    () => CompetitionMapper.fromDomainToDto(competition),
    [competition],
  );
  const router = useRouter();

  const competitionInstance = initialCompetitionInstance
    ? CompetitionInstanceMapper.fromDtoToDomain(initialCompetitionInstance)
    : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<CompetitionInstanceInput>({
    mode: 'all',
    // Bug workaround for https://github.com/colinhacks/zod/issues/3537
    resolver: zodResolver(competitionInstanceInputSchema) as Resolver<CompetitionInstanceInput>,
    defaultValues: competitionInstance
      ? {
          ...competitionInstance,
        }
      : {
          competitionId: parsedCompetition.id,
          name: '',
          shortname: '',
          description: '',
          url: '',
          organizer: '',
          organizerTypeId: '0',
          logo: undefined,
          startDate: new Date(),
          endDate: new Date(),
          location: '',
        },
  });

  const { handleSubmit: submit, control, formState } = methods;

  const name = useWatch({ name: 'name', control });
  const shortname = useWatch({ name: 'shortname', control });

  const handleSubmit = submit(async (data) => {
    if (formState.isDirty) {
      try {
        if (!competitionInstance) {
          const result = await createCompetitionInstance.execute({
            ...data,
            url: data.url ?? null,
            shortname: data.shortname ?? null,
          });

          match(result, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/competitions/${parsedCompetition.id}/instances/${data.id}`);
            },
          });
        } else {
          const result = await updateCompetitionInstance.execute(competitionInstance.id, {
            ...data,
            url: data.url ?? null,
            shortname: data.shortname ?? null,
          });

          match(result, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/competitions/${parsedCompetition.id}/instances/${data.id}`);
            },
          });
        }
      } catch (error) {
        console.error('Error submitting competition instance form:', error);
      }
    }
  });

  return (
    <>
      <SectionHeader
        title={
          competitionInstance
            ? `Edit ${shortname || name}`
            : `Add ${parsedCompetition.shortname || parsedCompetition.name}'s Instance`
        }
        backUrl={`/competitions/${parsedCompetition.id}/instances`}
      >
        <CompetitionInstanceToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
          <GeneralForm methods={methods} competitionOrganizerTypes={competitionOrganizerTypes} />
          <AttachmentForm methods={methods} />
        </Box>
      </LocalizationProvider>
    </>
  );
}
