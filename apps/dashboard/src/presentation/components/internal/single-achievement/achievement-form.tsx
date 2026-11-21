'use client';

import {
  AchievementDto,
  AchievementMapper,
  CompetitionOutputDto,
  CompetitionRankDto,
  CompetitionScaleDto,
  CompetitionTimeRangeDto,
} from '@infiniteuny/infinity-infrastructure/dtos';
import { AchievementToolbar } from './achievement-toolbar';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { Box } from '@mui/material';
import { CompetitionForm } from './competition-form';
import { clientContainer } from '@app/client-injection';
import { CreateAchievement, UpdateAchievement } from '@infiniteuny/infinity-application';
import { DocumentsForm } from './documents-form';
import { GeneralForm } from './general-form';
import { handleFormError } from '@app/presentation/utils';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { match } from 'effect/Either';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { toast } from 'react-toastify';
import { Resolver, useForm } from 'react-hook-form';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const achievementInputSchema = z
  .object({
    teamId: z.uuidv7('Team must be selected'),
    competitionInstanceId: z.uuidv7('Competition must be selected'),
    competitionScaleId: z.uuidv7('Competition scale must be selected'),
    competitionTimeRangeId: z.uuidv7('Competition time range must be selected'),
    competitionOutputId: z.uuidv7('Competition output must be selected'),
    competitionRankId: z.uuidv7('Competition rank must be selected'),
    competitionBranch: z.string().min(1, 'Competition branch must not be empty'),
    competitionStartDate: z.date('Competition start date must be a valid date'),
    competitionEndDate: z.date('Competition end date must be a valid date'),
    description: z.string().min(1, 'Description must not be empty'),
    image: z.union(
      [
        z
          .file('Image must not be empty')
          .mime(
            ['image/png', 'image/jpeg', 'image/webp'],
            'Image must be a PNG, JPEG, or WebP file',
          )
          .max(5120 * 1024, 'Image must be less than 5MB'),
        z.string().min(1, 'Image must not be empty'),
      ],
      { error: 'Image must not be empty' },
    ),
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
      message: 'Competition start date must be earlier than or equal to end date.',
      path: ['competitionStartDate'],
    },
  )
  .refine(
    (data) =>
      !data.competitionStartDate ||
      !data.competitionEndDate ||
      data.competitionEndDate >= data.competitionStartDate,
    {
      message: 'Competition end date must be later than or equal to start date.',
      path: ['competitionEndDate'],
    },
  );

export type AchievementInput = z.infer<typeof achievementInputSchema>;

type Props = {
  initialAchievement?: AchievementDto;
  competitionScales: CompetitionScaleDto[];
  competitionTimeRanges: CompetitionTimeRangeDto[];
  competitionOutputs: CompetitionOutputDto[];
  competitionRanks: CompetitionRankDto[];
};

export function AchievementForm({
  initialAchievement,
  competitionScales,
  competitionTimeRanges,
  competitionOutputs,
  competitionRanks,
}: Props) {
  const createAchievement = useMemo(
    () => clientContainer.get<CreateAchievement>(SYMBOLS.CreateAchievement),
    [],
  );
  const updateAchievement = useMemo(
    () => clientContainer.get<UpdateAchievement>(SYMBOLS.UpdateAchievement),
    [],
  );
  const router = useRouter();

  const achievement = initialAchievement
    ? AchievementMapper.fromDtoToDomain(initialAchievement)
    : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<AchievementInput>({
    mode: 'all',
    // Bug workaround for https://github.com/colinhacks/zod/issues/3537
    resolver: zodResolver(achievementInputSchema) as Resolver<AchievementInput>,
    defaultValues: achievement
      ? {
          teamId: achievement.teamId,
          competitionInstanceId: achievement.competitionInstanceId,
          competitionScaleId: achievement.competitionScaleId,
          competitionTimeRangeId: achievement.competitionTimeRangeId,
          competitionOutputId: achievement.competitionOutputId,
          competitionRankId: achievement.competitionRankId,
          competitionBranch: achievement.competitionBranch,
          competitionStartDate: achievement.competitionStartDate,
          competitionEndDate: achievement.competitionEndDate,
          description: achievement.description,
          image: achievement.image,
          status: achievement.status,
        }
      : {
          teamId: '',
          competitionInstanceId: '',
          competitionScaleId: '0',
          competitionTimeRangeId: '0',
          competitionOutputId: '0',
          competitionRankId: '0',
          competitionBranch: '',
          competitionStartDate: new Date(),
          competitionEndDate: new Date(),
          description: '',
          image: undefined,
          status: 'PENDING',
        },
  });

  const { handleSubmit: submit, formState } = methods;

  const handleSubmit = submit(async (data) => {
    if (formState.isDirty) {
      try {
        if (!achievement) {
          const achievementResult = await createAchievement.execute(data);

          match(achievementResult, {
            onLeft: (error) => {
              handleFormError(error, methods, 'Failed to create achievement.');
            },
            onRight: (result) => {
              toast.success('Achievement created successfully.');
              router.push(`/achievements/${result.id}`);
            },
          });
        } else {
          const achievementResult = await updateAchievement.execute(achievement.id, data);

          match(achievementResult, {
            onLeft: (error) => {
              handleFormError(error, methods, 'Failed to update achievement.');
            },
            onRight: (result) => {
              toast.success('Achievement updated successfully.');
              router.push(`/achievements/${result.id}`);
            },
          });
        }
      } catch (error) {
        handleFormError(error, methods, 'Failed to save achievement.');
      }
    }
  });

  return (
    <>
      <SectionHeader
        title={
          achievement
            ? achievement.competitionRank?.name && achievement.competitionInstance?.name
              ? `Edit ${achievement.competitionRank.name} ${achievement.competitionInstance.shortname || achievement.competitionInstance.name} ${achievement.competitionBranch}`
              : 'Edit Achievement'
            : 'Create Achievement'
        }
        backUrl={achievement ? `/achievements/${achievement.id}` : '/achievements'}
      >
        <AchievementToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
          <GeneralForm
            methods={methods}
            teams={initialAchievement?.team ? [initialAchievement.team] : undefined}
          />
          <CompetitionForm
            methods={methods}
            competitionScales={competitionScales}
            competitionTimeRanges={competitionTimeRanges}
            competitionOutputs={competitionOutputs}
            competitionRanks={competitionRanks}
            competitionInstances={
              initialAchievement?.competition_instance
                ? [initialAchievement.competition_instance]
                : undefined
            }
          />
          <DocumentsForm methods={methods} />
        </Box>
      </LocalizationProvider>
    </>
  );
}
