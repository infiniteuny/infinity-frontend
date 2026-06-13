import { cache } from 'react';
import { GetSession, GetTeam, GetTeamMembers } from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  TeamDto,
  TeamMapper,
  TeamMemberDto,
  TeamMemberMapper,
} from '@app/infrastructure/dtos';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  TeamMembersList,
  TeamMembersToolbar,
} from '@app/presentation/components/internal/team-members';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    teamId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getTeam = serverContainer.get<GetTeam>(SYMBOLS.GetTeam);
  const teamId = (await params).teamId;

  const [teamResult, sessionResult] = await Promise.all([
    cache(async () => await getTeam.execute(teamId))(),
    cache(async () => await getSession.execute())(),
  ]);

  const team = match(teamResult, {
    onLeft: (error) => {
      if (error instanceof NotFoundError) {
        notFound();
      } else {
        throw error;
      }
    },
    onRight: (data) => data,
  });
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (
    ['read-team-member'].some((p) => userPermissions.has(p)) ||
    (['read-own-team-member'].some((p) => userPermissions.has(p)) &&
      team.members?.some((member) => member.id === session.user.id))
  ) {
    return {
      title: `${team.name}'s Members`,
    };
  } else {
    notFound();
  }
}

export default async function TeamMembersPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getTeam = serverContainer.get<GetTeam>(SYMBOLS.GetTeam);
  const teamId = (await params).teamId;

  const [teamResult, sessionResult] = await Promise.all([
    cache(async () => await getTeam.execute(teamId))(),
    cache(async () => await getSession.execute())(),
  ]);

  const team = match(teamResult, {
    onLeft: (error) => {
      if (error instanceof NotFoundError) {
        notFound();
      } else {
        throw error;
      }
    },
    onRight: (data) => data,
  });
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (
    ['read-team-member'].some((p) => userPermissions.has(p)) ||
    (['read-own-team-member'].some((p) => userPermissions.has(p)) &&
      team.members?.some((member) => member.id === session.user.id))
  ) {
    const getTeamMembers = serverContainer.get<GetTeamMembers>(SYMBOLS.GetTeamMembers);

    const teamMembersResult = await getTeamMembers.execute(
      teamId,
      ['major', 'major.faculty'],
      undefined,
      undefined,
      { perPage: 25 },
    );
    const [teamMembers, paginationOptions] = match(teamMembersResult, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Teams', url: '/teams' },
          { label: team.name, url: `/teams/${teamId}` },
          { label: 'Members', url: `/teams/${teamId}/members` },
        ]}
      >
        <SectionHeader title={`${team.name}'s Members`} backUrl={`/teams/${teamId}`}>
          <TeamMembersToolbar teamId={teamId} />
        </SectionHeader>
        <TeamMembersList
          team={TeamMapper.fromDomainToDto(team) as TeamDto}
          initialTeamMembers={teamMembers.map(TeamMemberMapper.fromDomainToDto) as TeamMemberDto[]}
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
          }
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
