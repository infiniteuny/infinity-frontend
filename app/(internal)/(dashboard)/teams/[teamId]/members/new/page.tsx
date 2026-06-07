import { cache } from 'react';
import { GetSession, GetTeam } from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { TeamDto, TeamMapper } from '@app/infrastructure/dtos';
import { TeamMemberForm } from '@app/presentation/components/internal/single-team-member';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

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
    ['create-team-member'].some((p) => userPermissions.has(p)) ||
    (['create-own-team-member'].some((p) => userPermissions.has(p)) &&
      team.members?.some((member) => member.id === session.user.id))
  ) {
    return {
      title: `Add ${team.name}'s Members`,
    };
  } else {
    notFound();
  }
}

export default async function SingleTeamMemberNewPage({ params }: Props) {
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
    onRight: (team) => team,
  });

  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (
    ['create-team-member'].some((p) => userPermissions.has(p)) ||
    (['create-own-team-member'].some((p) => userPermissions.has(p)) &&
      team.members?.some((member) => member.id === session.user.id))
  ) {
    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Teams', url: '/teams' },
          { label: team.name, url: `/teams/${teamId}` },
          { label: 'Members', url: `/teams/${teamId}/members` },
          { label: 'Add', url: `/teams/${teamId}/members/new` },
        ]}
      >
        <TeamMemberForm team={TeamMapper.fromDomainToDto(team) as TeamDto} />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
