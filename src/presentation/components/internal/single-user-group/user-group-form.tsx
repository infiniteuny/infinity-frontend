'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateUserGroup } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { UserGroupToolbar } from './user-group-toolbar';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const userGroupInputSchema = z.object({
  groupId: z.uuidv7('Group must be selected'),
});

export type UserGroupInput = z.infer<typeof userGroupInputSchema>;

type Props = {
  userId: string;
};

export function UserGroupForm({ userId }: Props) {
  const createUserGroup = useMemo(
    () => clientContainer.get<CreateUserGroup>(SYMBOLS.CreateUserGroup),
    [],
  );
  const router = useRouter();

  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<UserGroupInput>({
    mode: 'all',
    // Bug workaround for https://github.com/colinhacks/zod/issues/3537
    resolver: zodResolver(userGroupInputSchema) as Resolver<UserGroupInput>,
    defaultValues: {
      groupId: '',
    },
  });

  const { handleSubmit: submit, formState } = methods;

  const handleSubmit = submit(async (data) => {
    if (!formState.isDirty) {
      return;
    }

    const result = await createUserGroup.execute(userId, data);

    match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: () => {
        router.push(`/users/${userId}/groups`);
      },
    });
  });

  return (
    <>
      <SectionHeader title="Add User Group">
        <UserGroupToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
