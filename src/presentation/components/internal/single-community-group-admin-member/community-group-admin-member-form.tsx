'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  CommunityGroupAdminMemberDto,
  CommunityGroupAdminMemberMapper,
  CommunityGroupDto,
} from '@app/infrastructure/dtos';
import { CommunityGroupAdminMemberToolbar } from './community-group-admin-member-toolbar';
import { CreateCommunityGroupAdminMember, UpdateCommunityGroupAdminMember } from '@app/application';
import { match } from 'effect/Either';
import { Resolver, useForm } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { GeneralForm } from './general-form';

const communityGroupAdminMemberInputSchema = z.object({
  userId: z.uuidv7('User must be selected'),
  communityGroupId: z.uuidv7('Community group must be selected'),
  photo: z.union([
    z
      .file('Photo must not be empty')
      .mime(['image/png', 'image/jpeg', 'image/webp'], 'Photo must be a PNG, JPEG, or WebP file')
      .max(5120 * 1024, 'Photo must be less than 5MB'),
    z.string(),
  ]),
  animation: z
    .union([
      z
        .file('Animation must not be empty')
        .mime(
          ['image/gif', 'image/apng', 'image/webp'],
          'Animation must be a GIF, APNG, or WebP file',
        )
        .max(5120 * 1024, 'Animation must be less than 5MB'),
      z.string(),
    ])
    .nullable(),
});

export type CommunityGroupAdminMemberInput = z.infer<typeof communityGroupAdminMemberInputSchema>;

type Props = {
  communityGroupAdminId: string;
  initialCommunityGroupAdminMember?: CommunityGroupAdminMemberDto;
  communityGroups: CommunityGroupDto[];
};

export function CommunityGroupAdminMemberForm({
  communityGroupAdminId,
  initialCommunityGroupAdminMember,
  communityGroups,
}: Props) {
  const createCommunityGroupAdminMember = useMemo(
    () =>
      clientContainer.get<CreateCommunityGroupAdminMember>(SYMBOLS.CreateCommunityGroupAdminMember),
    [],
  );
  const updateCommunityGroupAdminMember = useMemo(
    () =>
      clientContainer.get<UpdateCommunityGroupAdminMember>(SYMBOLS.UpdateCommunityGroupAdminMember),
    [],
  );
  const router = useRouter();

  const communityGroupAdminMember = initialCommunityGroupAdminMember
    ? CommunityGroupAdminMemberMapper.fromDtoToDomain(initialCommunityGroupAdminMember)
    : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<CommunityGroupAdminMemberInput>({
    mode: 'all',
    resolver: zodResolver(
      communityGroupAdminMemberInputSchema,
    ) as Resolver<CommunityGroupAdminMemberInput>,
    defaultValues: communityGroupAdminMember
      ? {
          userId: communityGroupAdminMember.membership.userId,
          communityGroupId: communityGroupAdminMember.membership.communityGroupId,
          photo: communityGroupAdminMember.membership.photo,
          animation: communityGroupAdminMember.membership.animation,
        }
      : {
          userId: '',
          communityGroupId: '0',
          photo: undefined,
          animation: null,
        },
  });

  const { handleSubmit: submit, formState } = methods;

  const handleSubmit = submit(async (data) => {
    if (!formState.isDirty) {
      return;
    }

    try {
      if (!communityGroupAdminMember) {
        const result = await createCommunityGroupAdminMember.execute(communityGroupAdminId, {
          userId: data.userId,
          communityGroupId: data.communityGroupId,
          photo: data.photo as File,
          animation: data.animation ? (data.animation as File) : null,
        });

        match(result, {
          onLeft: (error) => {
            throw error;
          },
          onRight: () => {
            router.push(`/community-group-admins/${communityGroupAdminId}/members`);
          },
        });
      } else {
        const result = await updateCommunityGroupAdminMember.execute(communityGroupAdminMember.id, {
          userId: data.userId,
          communityGroupId: data.communityGroupId,
          photo: data.photo instanceof File ? (data.photo as File) : undefined,
          animation:
            data.animation instanceof File
              ? (data.animation as File)
              : data.animation === null
                ? null
                : undefined,
        });

        match(result, {
          onLeft: (error) => {
            throw error;
          },
          onRight: () => {
            router.push(
              `/community-group-admins/${communityGroupAdminId}/members/${communityGroupAdminMember.id}`,
            );
          },
        });
      }
    } catch (error) {
      console.error('Error submitting community group admin member form:', error);
    }
  });

  return (
    <>
      <SectionHeader
        title={
          communityGroupAdminMember
            ? 'Edit Community Group Admin Member'
            : 'Add Community Group Admin Member'
        }
      >
        <CommunityGroupAdminMemberToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} communityGroups={communityGroups} />
      </Box>
    </>
  );
}
