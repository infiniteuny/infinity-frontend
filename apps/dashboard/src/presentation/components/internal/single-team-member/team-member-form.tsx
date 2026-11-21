'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateTeamMember } from '@infiniteuny/infinity-application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { TeamDto, TeamMapper } from '@infiniteuny/infinity-infrastructure/dtos';
import { TeamMemberToolbar } from './team-member-toolbar';
import { handleFormError } from '@app/presentation/utils';
import { toast } from 'react-toastify';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const teamMemberInputSchema = z.object({
  userId: z.uuidv7('User must be selected'),
});

export type TeamMemberInput = z.infer<typeof teamMemberInputSchema>;

type Props = {
  team: TeamDto;
};

export function TeamMemberForm({ team }: Props) {
  const createTeamMember = useMemo(
    () => clientContainer.get<CreateTeamMember>(SYMBOLS.CreateTeamMember),
    [],
  );
  const parsedTeam = useMemo(() => TeamMapper.fromDtoToDomain(team), [team]);
  const router = useRouter();

  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<TeamMemberInput>({
    mode: 'all',
    // Bug workaround for https://github.com/colinhacks/zod/issues/3537
    resolver: zodResolver(teamMemberInputSchema) as Resolver<TeamMemberInput>,
    defaultValues: {
      userId: '',
    },
  });

  const { handleSubmit: submit, formState } = methods;

  const handleSubmit = submit(async (data) => {
    if (!formState.isDirty) {
      return;
    }

    try {
      const result = await createTeamMember.execute(parsedTeam.id, data);

      match(result, {
        onLeft: (error) => {
          handleFormError(error, methods, 'Failed to add team member.');
        },
        onRight: () => {
          toast.success('Team member added successfully.');
          router.push(`/teams/${parsedTeam.id}/members`);
        },
      });
    } catch (error) {
      handleFormError(error, methods, 'Failed to add team member.');
    }
  });

  return (
    <>
      <SectionHeader
        title={`Add ${parsedTeam.name}'s Member`}
        backUrl={`/teams/${team.id}/members`}
      >
        <TeamMemberToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
