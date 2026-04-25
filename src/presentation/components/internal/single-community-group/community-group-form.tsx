'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateCommunityGroup, UpdateCommunityGroup } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { CommunityGroupDto, CommunityGroupMapper } from '@app/infrastructure/dtos';
import { CommunityGroupToolbar } from './community-group-toolbar';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const communityGroupInputSchema = z.object({
  name: z.string().min(1, 'Name must not be empty'),
  priority: z.number('Priority must be a number').min(0, 'Priority must be non-negative'),
  description: z.string().min(1, 'Description must not be empty'),
  logo: z.string().min(1, 'Logo must not be empty'),
  isActive: z.boolean(),
});

export type CommunityGroupInput = z.infer<typeof communityGroupInputSchema>;

type Props = {
  initialCommunityGroup?: CommunityGroupDto;
};

export function CommunityGroupForm({ initialCommunityGroup }: Props) {
  const createCommunityGroup = useMemo(
    () => clientContainer.get<CreateCommunityGroup>(SYMBOLS.CreateCommunityGroup),
    [],
  );
  const updateCommunityGroup = useMemo(
    () => clientContainer.get<UpdateCommunityGroup>(SYMBOLS.UpdateCommunityGroup),
    [],
  );
  const router = useRouter();

  const communityGroup = initialCommunityGroup
    ? CommunityGroupMapper.fromDtoToDomain(initialCommunityGroup)
    : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<CommunityGroupInput>({
    mode: 'all',
    resolver: zodResolver(communityGroupInputSchema) as Resolver<CommunityGroupInput>,
    defaultValues: communityGroup
      ? {
          ...communityGroup,
        }
      : {
          name: '',
          priority: 0,
          description: '',
          logo: '',
          isActive: false,
        },
  });

  const { handleSubmit: submit, control, formState } = methods;

  const name = useWatch({ name: 'name', control });

  const handleSubmit = submit(async (data) => {
    if (formState.isDirty) {
      try {
        if (!communityGroup) {
          const communityGroupResult = await createCommunityGroup.execute(data);

          match(communityGroupResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/community-groups/${data.id}`);
            },
          });
        } else {
          const communityGroupResult = await updateCommunityGroup.execute(communityGroup.id, data);

          match(communityGroupResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/community-groups/${data.id}`);
            },
          });
        }
      } catch (error) {
        console.error('Error submitting community group form:', error);
      }
    }
  });

  return (
    <>
      <SectionHeader title={communityGroup ? name : 'Create Community Group'}>
        <CommunityGroupToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
