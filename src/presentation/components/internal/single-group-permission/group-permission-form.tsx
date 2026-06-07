'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateGroupPermission } from '@app/application';
import { GeneralForm } from './general-form';
import { GroupDto, GroupMapper } from '@app/infrastructure/dtos';
import { match } from 'effect/Either';
import { Resolver, useForm } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { GroupPermissionToolbar } from './group-permission-toolbar';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const groupPermissionInputSchema = z.object({
  permissionId: z.uuidv7('Permission must be selected'),
});

export type GroupPermissionInput = z.infer<typeof groupPermissionInputSchema>;

type Props = {
  group: GroupDto;
};

export function GroupPermissionForm({ group }: Props) {
  const createGroupPermission = useMemo(
    () => clientContainer.get<CreateGroupPermission>(SYMBOLS.CreateGroupPermission),
    [],
  );
  const parsedGroup = useMemo(() => GroupMapper.fromDtoToDomain(group), [group]);
  const router = useRouter();

  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<GroupPermissionInput>({
    mode: 'all',
    // Bug workaround for https://github.com/colinhacks/zod/issues/3537
    resolver: zodResolver(groupPermissionInputSchema) as Resolver<GroupPermissionInput>,
    defaultValues: {
      permissionId: '',
    },
  });

  const { handleSubmit: submit, formState } = methods;

  const handleSubmit = submit(async (data) => {
    if (!formState.isDirty) {
      return;
    }

    const result = await createGroupPermission.execute(parsedGroup.id, data);

    match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: () => {
        router.push(`/groups/${parsedGroup.id}/permissions`);
      },
    });
  });

  return (
    <>
      <SectionHeader
        title={`Add ${parsedGroup.name}'s Permission`}
        backUrl={`/groups/${parsedGroup.id}/permissions`}
      >
        <GroupPermissionToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
