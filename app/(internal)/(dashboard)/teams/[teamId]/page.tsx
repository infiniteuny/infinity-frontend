import { cache } from 'react';
import { GetCompetitionTeamTypes, GetSession, GetTeam } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  TeamDto,
  TeamMapper,
  CompetitionTeamTypeDto,
  CompetitionTeamTypeMapper,
} from '@app/infrastructure/dtos';
import { TeamForm, TeamToolbar, TeamView } from '@app/presentation/components/internal/single-team';

type Props = {
  params: Promise<{
    teamId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const teamId = (await params).teamId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (teamId !== 'new' && ['read-team', 'read-own-team'].some((p) => userPermissions.has(p))) {
    const getTeam = serverContainer.get<GetTeam>(SYMBOLS.GetTeam);

    const teamResult = await cache(async () => await getTeam.execute(teamId))();
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

    return {
      title: team.name,
    };
  } else if (
    teamId === 'new' &&
    ['create-team', 'create-own-team'].some((p) => userPermissions.has(p))
  ) {
    return {
      title: 'Create Team',
    };
  } else {
    notFound();
  }
}

export default async function SingleTeamPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const teamId = (await params).teamId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (teamId !== 'new' && ['read-team', 'read-own-team'].some((p) => userPermissions.has(p))) {
    const getTeam = serverContainer.get<GetTeam>(SYMBOLS.GetTeam);

    const teamResult = await cache(
      async () => await getTeam.execute(teamId, ['leader', 'members', 'team_type']),
    )();
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

    if (
      !['read-team'].some((p) => userPermissions.has(p)) &&
      !team.members?.some((member) => member.id === session.user.id)
    ) {
      notFound();
    }

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Teams', url: '/teams' },
          { label: team.name, url: `/teams/${team.id}` },
        ]}
      >
        <SectionHeader title={team.name} backUrl="/teams">
          <TeamToolbar team={TeamMapper.fromDomainToDto(team) as TeamDto} />
        </SectionHeader>
        <TeamView initialTeam={TeamMapper.fromDomainToDto(team) as TeamDto} />
      </InternalMain>
    );
  } else if (
    teamId === 'new' &&
    ['create-team', 'create-own-team'].some((p) => userPermissions.has(p))
  ) {
    const getCompetitionTeamTypes = serverContainer.get<GetCompetitionTeamTypes>(
      SYMBOLS.GetCompetitionTeamTypes,
    );
    const teamTypesResult = await getCompetitionTeamTypes.execute(undefined, {
      perPage: 100,
    });
    const [teamTypes] = match(teamTypesResult, {
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
          { label: 'Create Team', url: `/teams/new` },
        ]}
      >
        <TeamForm
          teamTypes={
            teamTypes.map(CompetitionTeamTypeMapper.fromDomainToDto) as CompetitionTeamTypeDto[]
          }
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
