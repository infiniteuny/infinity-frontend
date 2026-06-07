import { cache } from 'react';
import {
  CompetitionTeamTypeDto,
  CompetitionTeamTypeMapper,
  TeamDto,
  TeamMapper,
} from '@app/infrastructure/dtos';
import { GetCompetitionTeamTypes, GetSession, GetTeam } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { TeamForm } from '@app/presentation/components/internal/single-team';

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

  if (['update-team', 'update-own-team'].some((p) => userPermissions.has(p))) {
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
      title: `Edit ${team.name}`,
    };
  } else {
    notFound();
  }
}

export default async function SingleTeamEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-team', 'update-own-team'].some((p) => userPermissions.has(p))) {
    const getTeam = serverContainer.get<GetTeam>(SYMBOLS.GetTeam);
    const getCompetitionTeamTypes = serverContainer.get<GetCompetitionTeamTypes>(
      SYMBOLS.GetCompetitionTeamTypes,
    );
    const teamId = (await params).teamId;

    const teamResult = await cache(async () => await getTeam.execute(teamId, ['leader']))();
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
      !['update-team'].some((p) => userPermissions.has(p)) &&
      !team?.members?.some((member) => member.id === session.user.id)
    ) {
      notFound();
    }

    const teamTypesResult = await getCompetitionTeamTypes.execute(undefined, {
      perPage: 10,
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
          { label: team.name, url: `/teams/${team.id}` },
          { label: 'Edit', url: `/teams/${team.id}/edit` },
        ]}
      >
        <TeamForm
          initialTeam={TeamMapper.fromDomainToDto(team) as TeamDto}
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
