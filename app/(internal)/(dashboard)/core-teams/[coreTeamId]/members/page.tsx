import { cache } from 'react';
import { CoreTeamMembersList } from '@app/presentation/components/internal/core-team-members';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  CoreTeamMemberDto,
  CoreTeamMemberMapper,
} from '@app/infrastructure/dtos';
import { GetCoreTeam, GetCoreTeamMembers } from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    coreTeamId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getCoreTeam = serverContainer.get<GetCoreTeam>(SYMBOLS.GetCoreTeam);
  const coreTeamId = (await params).coreTeamId;

  const coreTeamResult = await cache(async () => await getCoreTeam.execute(coreTeamId))();
  const coreTeam = match(coreTeamResult, {
    onLeft: (error) => {
      if (error instanceof NotFoundError) {
        notFound();
      } else {
        throw error;
      }
    },
    onRight: (data) => data,
  });

  return {
    title: `${coreTeam.year}'s Members`,
  };
}

export default async function CoreTeamMembersPage({ params }: Props) {
  const getCoreTeam = serverContainer.get<GetCoreTeam>(SYMBOLS.GetCoreTeam);
  const getCoreTeamMembers = serverContainer.get<GetCoreTeamMembers>(SYMBOLS.GetCoreTeamMembers);
  const coreTeamId = (await params).coreTeamId;

  const [coreTeamResult, coreTeamMembersResult] = await Promise.all([
    cache(async () => await getCoreTeam.execute(coreTeamId))(),
    getCoreTeamMembers.execute(
      coreTeamId,
      ['major', 'major.faculty', 'membership.core_team_division'],
      undefined,
      undefined,
      { perPage: 25 },
    ),
  ]);

  const coreTeam = match(coreTeamResult, {
    onLeft: (error) => {
      if (error instanceof NotFoundError) {
        notFound();
      } else {
        throw error;
      }
    },
    onRight: (data) => data,
  });
  const [coreTeamMembers, paginationOptions] = match(coreTeamMembersResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <InternalMain
      breadcrumbs={[
        { label: 'Overview', url: '/' },
        { label: 'Core Teams', url: '/core-teams' },
        { label: coreTeam.year.toString(), url: `/core-teams/${coreTeamId}` },
        { label: 'Members', url: `/core-teams/${coreTeamId}/members` },
      ]}
    >
      <CoreTeamMembersList
        coreTeamId={coreTeamId}
        initialCoreTeamMembers={
          coreTeamMembers.map(CoreTeamMemberMapper.fromDomainToDto) as CoreTeamMemberDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </InternalMain>
  );
}
