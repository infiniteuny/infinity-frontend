'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  CoreTeamDivisionDto,
  CoreTeamDto,
  CoreTeamMapper,
  CoreTeamMemberDto,
  CoreTeamMemberMapper,
} from '@app/infrastructure/dtos';
import { CoreTeamMemberToolbar } from './core-team-member-toolbar';
import { CreateCoreTeamMember, UpdateCoreTeamMember } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const coreTeamMemberInputSchema = z.object({
  userId: z.uuidv7('User must be selected'),
  coreTeamDivisionId: z.uuidv7('Division must be selected'),
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

export type CoreTeamMemberInput = z.infer<typeof coreTeamMemberInputSchema>;

type Props = {
  coreTeam: CoreTeamDto;
  initialCoreTeamMember?: CoreTeamMemberDto;
  coreTeamDivisions: CoreTeamDivisionDto[];
};

export function CoreTeamMemberForm({ coreTeam, initialCoreTeamMember, coreTeamDivisions }: Props) {
  const createCoreTeamMember = useMemo(
    () => clientContainer.get<CreateCoreTeamMember>(SYMBOLS.CreateCoreTeamMember),
    [],
  );
  const updateCoreTeamMember = useMemo(
    () => clientContainer.get<UpdateCoreTeamMember>(SYMBOLS.UpdateCoreTeamMember),
    [],
  );
  const parsedCoreTeam = useMemo(() => CoreTeamMapper.fromDtoToDomain(coreTeam), [coreTeam]);
  const router = useRouter();

  const coreTeamMember = initialCoreTeamMember
    ? CoreTeamMemberMapper.fromDtoToDomain(initialCoreTeamMember)
    : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<CoreTeamMemberInput>({
    mode: 'all',
    resolver: zodResolver(coreTeamMemberInputSchema) as Resolver<CoreTeamMemberInput>,
    defaultValues: coreTeamMember
      ? {
          userId: coreTeamMember.membership.userId,
          coreTeamDivisionId: coreTeamMember.membership.coreTeamDivisionId,
          photo: coreTeamMember.membership.photo,
          animation: coreTeamMember.membership.animation,
        }
      : {
          userId: '',
          coreTeamDivisionId: '0',
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
      if (!coreTeamMember) {
        const result = await createCoreTeamMember.execute(parsedCoreTeam.id, {
          userId: data.userId,
          coreTeamDivisionId: data.coreTeamDivisionId,
          photo: data.photo as File,
          animation: data.animation ? (data.animation as File) : null,
        });

        match(result, {
          onLeft: (error) => {
            throw error;
          },
          onRight: () => {
            router.push(`/core-teams/${parsedCoreTeam.id}/members`);
          },
        });
      } else {
        const result = await updateCoreTeamMember.execute(coreTeamMember.id, {
          userId: data.userId,
          coreTeamDivisionId: data.coreTeamDivisionId,
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
            router.push(`/core-teams/${parsedCoreTeam.id}/members/${coreTeamMember.membership.id}`);
          },
        });
      }
    } catch (error) {
      console.error('Error submitting core team member form:', error);
    }
  });

  return (
    <>
      <SectionHeader
        title={
          coreTeamMember ? `Edit ${coreTeamMember.name}` : `Add ${parsedCoreTeam.year}'s Member`
        }
        backUrl={
          coreTeamMember
            ? `/core-teams/${parsedCoreTeam.id}/members/${coreTeamMember.membership.id}`
            : `/core-teams/${parsedCoreTeam.id}/members`
        }
      >
        <CoreTeamMemberToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} coreTeamDivisions={coreTeamDivisions} />
      </Box>
    </>
  );
}
