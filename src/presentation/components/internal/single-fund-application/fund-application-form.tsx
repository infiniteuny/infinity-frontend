'use client';

import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { Box } from '@mui/material';
import { CompetitionForm } from './competition-form';
import { clientContainer } from '@app/client-injection';
import { CreateFundApplication, UpdateFundApplication } from '@app/application';
import { DocumentsForm } from './documents-form';
import {
  CompetitionScaleDto,
  FundApplicationDto,
  FundApplicationMapper,
} from '@app/infrastructure/dtos';
import { FundApplicationToolbar } from './fund-application-toolbar';
import { GeneralForm } from './general-form';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { match } from 'effect/Either';
import { Resolver, useForm } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const fundApplicationInputSchema = z
  .object({
    teamId: z.uuidv7('Team must be selected'),
    competitionInstanceId: z.uuidv7('Competition instance must be selected'),
    competitionScaleId: z.uuidv7('Scale must be selected'),
    competitionBranch: z.string().min(1, 'Competition branch must not be empty'),
    competitionStartDate: z.date('Start date must be a valid date'),
    competitionEndDate: z.date('End date must be a valid date'),
    letterOfAcceptance: z.union([
      z
        .file('Letter of Acceptance must not be empty')
        .mime(['application/pdf'], 'Letter of acceptance must be a PDF file')
        .max(20480000, 'Letter of acceptance must be less than or equal to 20MB'),
      z.string(),
    ]),
    proposal: z.union([
      z
        .file('Proposal must not be empty')
        .mime(
          [
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ],
          'Proposal must be a DOC or DOCX file',
        )
        .max(20480000, 'Proposal must be less than or equal to 20MB'),
      z.string(),
    ]),
    status: z.enum(
      ['PENDING', 'REJECTED', 'ACCEPTED'] as const,
      'Status must be one of pending, rejected, or accepted',
    ),
  })
  .refine(
    (data) =>
      !data.competitionStartDate ||
      !data.competitionEndDate ||
      data.competitionStartDate <= data.competitionEndDate,
    {
      message: 'Start date must be earlier than or equal to end date.',
      path: ['competitionStartDate'],
    },
  )
  .refine(
    (data) =>
      !data.competitionStartDate ||
      !data.competitionEndDate ||
      data.competitionEndDate >= data.competitionStartDate,
    {
      message: 'End date must be later than or equal to start date.',
      path: ['competitionEndDate'],
    },
  );

export type FundApplicationInput = z.infer<typeof fundApplicationInputSchema>;

type Props = {
  initialFundApplication?: FundApplicationDto;
  competitionScales: CompetitionScaleDto[];
};

export function FundApplicationForm({ initialFundApplication, competitionScales }: Props) {
  const createFundApplication = useMemo(
    () => clientContainer.get<CreateFundApplication>(SYMBOLS.CreateFundApplication),
    [],
  );
  const updateFundApplication = useMemo(
    () => clientContainer.get<UpdateFundApplication>(SYMBOLS.UpdateFundApplication),
    [],
  );
  const router = useRouter();

  const fundApplication = initialFundApplication
    ? FundApplicationMapper.fromDtoToDomain(initialFundApplication)
    : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<FundApplicationInput>({
    mode: 'all',
    // Bug workaround for https://github.com/colinhacks/zod/issues/3537
    resolver: zodResolver(fundApplicationInputSchema) as Resolver<FundApplicationInput>,
    defaultValues: fundApplication
      ? {
          ...fundApplication,
        }
      : {
          teamId: '',
          competitionInstanceId: '',
          competitionScaleId: '0',
          competitionBranch: '',
          competitionStartDate: new Date(),
          competitionEndDate: new Date(),
          letterOfAcceptance: undefined,
          proposal: undefined,
          status: 'PENDING',
        },
  });

  const { handleSubmit: submit, formState } = methods;

  const handleSubmit = submit(async (data) => {
    if (formState.isDirty) {
      try {
        if (!fundApplication) {
          const fundApplicationResult = await createFundApplication.execute(data);

          match(fundApplicationResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (result) => {
              // TODO: Add snackbar for success state
              router.push(`/fund-applications/${result.id}`);
            },
          });
        } else {
          const fundApplicationResult = await updateFundApplication.execute(
            fundApplication.id,
            data,
          );

          match(fundApplicationResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (result) => {
              // TODO: Add snackbar for success state
              router.push(`/fund-applications/${result.id}`);
            },
          });
        }
      } catch (error) {
        // TODO: Implement proper error handling and add snackbar for error state
        console.error('Error submitting fund application form:', error);
      }
    }
  });

  return (
    <>
      <SectionHeader
        title={
          fundApplication
            ? fundApplication.competitionInstance?.name
              ? `Edit ${fundApplication.competitionInstance.shortname || fundApplication.competitionInstance.name} ${fundApplication.competitionBranch}`
              : 'Edit Fund Application'
            : 'Create Fund Application'
        }
      >
        <FundApplicationToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
          <GeneralForm
            methods={methods}
            teams={initialFundApplication?.team ? [initialFundApplication.team] : undefined}
          />
          <CompetitionForm
            methods={methods}
            competitionScales={competitionScales}
            competitionInstances={
              initialFundApplication?.competition_instance
                ? [initialFundApplication.competition_instance]
                : undefined
            }
          />
          <DocumentsForm methods={methods} />
        </Box>
      </LocalizationProvider>
    </>
  );
}
