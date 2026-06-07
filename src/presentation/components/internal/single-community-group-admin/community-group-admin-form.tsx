'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CommunityGroupAdminDto, CommunityGroupAdminMapper } from '@app/infrastructure/dtos';
import { CommunityGroupAdminToolbar } from './community-group-admin-toolbar';
import { CreateCommunityGroupAdmin, UpdateCommunityGroupAdmin } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const communityGroupAdminInputSchema = z
  .object({
    _new: z.boolean(),
    _initial: z.boolean(),
    year: z.number('Year must be a number').int('Year must be an integer').min(2014).max(9999),
    isActive: z.boolean(),
  })
  .refine((data) => data.isActive || data._new || (!data._new && !data._initial), {
    message:
      'Active community group administrator cannot be deactivated, please set another as active to deactivate this one.',
    path: ['isActive'],
    when: (payload) => z.object({ isActive: z.boolean() }).safeParse(payload.value).success,
  });

export type CommunityGroupAdminInput = z.infer<typeof communityGroupAdminInputSchema>;

type Props = {
  initialCommunityGroupAdmin?: CommunityGroupAdminDto;
};

export function CommunityGroupAdminForm({ initialCommunityGroupAdmin }: Props) {
  const createCommunityGroupAdmin = useMemo(
    () => clientContainer.get<CreateCommunityGroupAdmin>(SYMBOLS.CreateCommunityGroupAdmin),
    [],
  );
  const updateCommunityGroupAdmin = useMemo(
    () => clientContainer.get<UpdateCommunityGroupAdmin>(SYMBOLS.UpdateCommunityGroupAdmin),
    [],
  );
  const router = useRouter();

  const communityGroupAdmin = initialCommunityGroupAdmin
    ? CommunityGroupAdminMapper.fromDtoToDomain(initialCommunityGroupAdmin)
    : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<CommunityGroupAdminInput>({
    mode: 'all',
    // Bug workaround for https://github.com/colinhacks/zod/issues/3537
    resolver: zodResolver(communityGroupAdminInputSchema) as Resolver<CommunityGroupAdminInput>,
    defaultValues: communityGroupAdmin
      ? {
          ...communityGroupAdmin,
          _new: false,
          _initial: communityGroupAdmin.isActive,
        }
      : {
          year: undefined,
          isActive: false,
          _new: true,
          _initial: false,
        },
  });

  const { handleSubmit: submit, control, formState } = methods;

  const name = useWatch({ name: 'year', control });

  const handleSubmit = submit(async (data) => {
    if (formState.isDirty) {
      try {
        if (!communityGroupAdmin) {
          const communityGroupAdminResult = await createCommunityGroupAdmin.execute(data);

          match(communityGroupAdminResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              // TODO: Add snackbar for success state
              router.push(`/community-group-admins/${data.id}`);
            },
          });
        } else {
          const communityGroupAdminResult = await updateCommunityGroupAdmin.execute(
            communityGroupAdmin.id,
            data,
          );

          match(communityGroupAdminResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              // TODO: Add snackbar for success state
              router.push(`/community-group-admins/${data.id}`);
            },
          });
        }
      } catch (error) {
        // TODO: Implement proper error handling and add snackbar for error state
        console.error('Error submitting community group admin form:', error);
      }
    }
  });

  return (
    <>
      <SectionHeader
        title={communityGroupAdmin ? `Edit ${name}` : 'Create Community Group Administrator'}
        backUrl={
          communityGroupAdmin
            ? `/community-group-admins/${communityGroupAdmin.id}`
            : '/community-group-admins'
        }
      >
        <CommunityGroupAdminToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
