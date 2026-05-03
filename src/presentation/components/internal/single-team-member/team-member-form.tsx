'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateTeamMember } from '@app/application';
import { match } from 'effect/Either';
import { Resolver, useForm } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { TeamMemberToolbar } from './team-member-toolbar';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { GeneralForm } from './general-form';

const teamMemberInputSchema = z.object({
  userId: z.uuidv7('User must be selected'),
});

export type TeamMemberInput = z.infer<typeof teamMemberInputSchema>;

type Props = {
  teamId: string;
};

export function TeamMemberForm({ teamId }: Props) {
  const createTeamMember = useMemo(
    () => clientContainer.get<CreateTeamMember>(SYMBOLS.CreateTeamMember),
    [],
  );
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

    const result = await createTeamMember.execute(teamId, data);

    match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: () => {
        router.push(`/teams/${teamId}/members`);
      },
    });
  });

  return (
    <>
      <SectionHeader title="Add Team Member">
        <TeamMemberToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
