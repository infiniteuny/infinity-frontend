'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateCommunityGroupMember } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { UserCommunityGroupToolbar } from './user-community-group-toolbar';
import { useMemo, useRef } from 'react';
import { UserDto, UserMapper } from '@app/infrastructure/dtos';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const userCommunityGroupInputSchema = z.object({
  communityGroupId: z.uuidv7('Community group must be selected'),
});

export type UserCommunityGroupInput = z.infer<typeof userCommunityGroupInputSchema>;

type Props = {
  user: UserDto;
};

export function UserCommunityGroupForm({ user }: Props) {
  const createCommunityGroupMember = useMemo(
    () => clientContainer.get<CreateCommunityGroupMember>(SYMBOLS.CreateCommunityGroupMember),
    [],
  );
  const parsedUser = useMemo(() => UserMapper.fromDtoToDomain(user), [user]);
  const router = useRouter();

  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<UserCommunityGroupInput>({
    mode: 'all',
    // Bug workaround for https://github.com/colinhacks/zod/issues/3537
    resolver: zodResolver(userCommunityGroupInputSchema) as Resolver<UserCommunityGroupInput>,
    defaultValues: {
      communityGroupId: '',
    },
  });

  const { handleSubmit: submit, formState } = methods;

  const handleSubmit = submit(async (data) => {
    if (!formState.isDirty) {
      return;
    }

    const result = await createCommunityGroupMember.execute(data.communityGroupId, {
      userId: parsedUser.id,
    });

    match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: () => {
        router.push(`/users/${parsedUser.id}/community-groups`);
      },
    });
  });

  return (
    <>
      <SectionHeader
        title={`Add ${parsedUser.name}'s Community Group`}
        backUrl={`/users/${parsedUser.id}/community-groups`}
      >
        <UserCommunityGroupToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
