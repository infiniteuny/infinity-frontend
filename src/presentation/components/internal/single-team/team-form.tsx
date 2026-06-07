'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateTeam, UpdateTeam } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { CompetitionTeamTypeDto, TeamDto, TeamMapper } from '@app/infrastructure/dtos';
import { TeamToolbar } from './team-toolbar';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const teamInputSchema = z.object({
  name: z.string().min(1, 'Name must not be empty'),
  leaderId: z.uuidv7('Leader must be selected'),
  teamTypeId: z.uuidv7('Team type must be selected'),
  isPersonal: z.boolean(),
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
          ...team,
        }
      : {
          name: '',
          leaderId: '',
          teamTypeId: '0',
          isPersonal: false,
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
              throw error;
            },
            onRight: (data) => {
              // TODO: Add snackbar for success state
              router.push(`/teams/${data.id}`);
            },
          });
        } else {
          const teamResult = await updateTeam.execute(team.id, data);

          match(teamResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              // TODO: Add snackbar for success state
              router.push(`/teams/${data.id}`);
            },
          });
        }
      } catch (error) {
        // TODO: Implement proper error handling and add snackbar for error state
        console.error('Error submitting team form:', error);
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
