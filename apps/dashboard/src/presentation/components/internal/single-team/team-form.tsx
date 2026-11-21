'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateTeam, UpdateTeam } from '@infiniteuny/infinity-application';
import { GeneralForm } from './general-form';
import { handleFormError } from '@app/presentation/utils';
import { match } from 'effect/Either';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { toast } from 'react-toastify';
import {
  CompetitionTeamTypeDto,
  TeamDto,
  TeamMapper,
} from '@infiniteuny/infinity-infrastructure/dtos';
import { TeamToolbar } from './team-toolbar';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const teamInputSchema = z.object({
  name: z.string().min(1, 'Name must not be empty'),
  leaderId: z.uuidv7('Leader must be selected'),
  teamTypeId: z.uuidv7('Team type must be selected'),
});

export type TeamInput = z.infer<typeof teamInputSchema>;

type Props = {
  initialTeam?: TeamDto;
  teamTypes: CompetitionTeamTypeDto[];
};

export function TeamForm({ initialTeam, teamTypes }: Props) {
  const createTeam = useMemo(() => clientContainer.get<CreateTeam>(SYMBOLS.CreateTeam), []);
  const updateTeam = useMemo(() => clientContainer.get<UpdateTeam>(SYMBOLS.UpdateTeam), []);
  const router = useRouter();

  const team = initialTeam ? TeamMapper.fromDtoToDomain(initialTeam) : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<TeamInput>({
    mode: 'all',
    // Bug workaround for https://github.com/colinhacks/zod/issues/3537
    resolver: zodResolver(teamInputSchema) as Resolver<TeamInput>,
    defaultValues: team
      ? {
          name: team.name,
          leaderId: team.leaderId,
          teamTypeId: team.teamTypeId,
        }
      : {
          name: '',
          leaderId: '',
          teamTypeId: '0',
        },
  });

  const { handleSubmit: submit, control, formState } = methods;

  const name = useWatch({ name: 'name', control });

  const handleSubmit = submit(async (data) => {
    if (formState.isDirty) {
      try {
        if (!team) {
          const teamResult = await createTeam.execute(data);

          match(teamResult, {
            onLeft: (error) => {
              handleFormError(error, methods, 'Failed to create team.');
            },
            onRight: (data) => {
              toast.success('Team created successfully.');
              router.push(`/teams/${data.id}`);
            },
          });
        } else {
          const teamResult = await updateTeam.execute(team.id, data);

          match(teamResult, {
            onLeft: (error) => {
              handleFormError(error, methods, 'Failed to update team.');
            },
            onRight: (data) => {
              toast.success('Team updated successfully.');
              router.push(`/teams/${data.id}`);
            },
          });
        }
      } catch (error) {
        handleFormError(error, methods, 'Failed to save team.');
      }
    }
  });

  return (
    <>
      <SectionHeader
        title={team ? `Edit ${name}` : 'Create Team'}
        backUrl={team ? `/teams/${team.id}` : '/teams'}
      >
        <TeamToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm
          methods={methods}
          teamTypes={teamTypes}
          users={initialTeam?.leader ? [initialTeam.leader] : undefined}
        />
      </Box>
    </>
  );
}
