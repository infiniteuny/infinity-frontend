'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateCommunityGroupMember } from '@app/application';
import { match } from 'effect/Either';
import { Resolver, useForm } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { CommunityGroupMemberToolbar } from './community-group-member-toolbar';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { GeneralForm } from './general-form';
import { CommunityGroupDto, CommunityGroupMapper } from '@app/infrastructure/dtos';

const communityGroupMemberInputSchema = z.object({
  userId: z.uuidv7('User must be selected'),
});

export type CommunityGroupMemberInput = z.infer<typeof communityGroupMemberInputSchema>;

type Props = {
  communityGroup: CommunityGroupDto;
};

export function CommunityGroupMemberForm({ communityGroup }: Props) {
  const createCommunityGroupMember = useMemo(
    () => clientContainer.get<CreateCommunityGroupMember>(SYMBOLS.CreateCommunityGroupMember),
    [],
  );
  const parsedCommunityGroup = useMemo(
    () => CommunityGroupMapper.fromDtoToDomain(communityGroup),
    [communityGroup],
  );
  const router = useRouter();

  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<CommunityGroupMemberInput>({
    mode: 'all',
    // Bug workaround for https://github.com/colinhacks/zod/issues/3537
    resolver: zodResolver(communityGroupMemberInputSchema) as Resolver<CommunityGroupMemberInput>,
    defaultValues: {
      userId: '',
    },
  });

  const { handleSubmit: submit, formState } = methods;

  const handleSubmit = submit(async (data) => {
    if (!formState.isDirty) {
      return;
    }

    const result = await createCommunityGroupMember.execute(parsedCommunityGroup.id, data);

    match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: () => {
        router.push(`/community-groups/${parsedCommunityGroup.id}/members`);
      },
    });
  });

  return (
    <>
      <SectionHeader
        title={`Add ${parsedCommunityGroup.name} Member`}
        backUrl={`/community-groups/${parsedCommunityGroup.id}/members`}
      >
        <CommunityGroupMemberToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
