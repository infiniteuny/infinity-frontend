import { cache } from 'react';
import {
  CoreTeamDivisionDto,
  CoreTeamDivisionMapper,
  CoreTeamDto,
  CoreTeamMapper,
  CoreTeamMemberDto,
  CoreTeamMemberMapper,
} from '@app/infrastructure/dtos';
import { CoreTeamMemberForm } from '@app/presentation/components/internal/single-core-team-member';
import { GetCoreTeam, GetCoreTeamDivisions, GetCoreTeamMember, GetSession } from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { isLeft, match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    coreTeamId: string;
    memberId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getCoreTeam = serverContainer.get<GetCoreTeam>(SYMBOLS.GetCoreTeam);
  const { coreTeamId, memberId } = await params;

  const [coreTeamResult, sessionResult] = await Promise.all([
    cache(async () => await getCoreTeam.execute(coreTeamId))(),
    cache(async () => await getSession.execute())(),
  ]);

  if (isLeft(coreTeamResult)) {
    const error = coreTeamResult.left;

    if (error instanceof NotFoundError) {
      notFound();
    } else {
      throw error;
    }
  }

  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-core-team-member'].some((p) => userPermissions.has(p))) {
    const getCoreTeamMember = serverContainer.get<GetCoreTeamMember>(SYMBOLS.GetCoreTeamMember);

    const coreTeamMemberResult = await cache(
      async () => await getCoreTeamMember.execute(memberId, ['membership.core_team_division']),
    )();
    const coreTeamMember = match(coreTeamMemberResult, {
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
      title: `Edit ${coreTeamMember.name}`,
    };
  } else {
    notFound();
  }
}

export default async function SingleCoreTeamMemberEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getCoreTeam = serverContainer.get<GetCoreTeam>(SYMBOLS.GetCoreTeam);
  const { coreTeamId, memberId } = await params;

  const [coreTeamResult, sessionResult] = await Promise.all([
    cache(async () => await getCoreTeam.execute(coreTeamId))(),
    cache(async () => await getSession.execute())(),
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
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-core-team-member'].some((p) => userPermissions.has(p))) {
    const getCoreTeamMember = serverContainer.get<GetCoreTeamMember>(SYMBOLS.GetCoreTeamMember);
    const getCoreTeamDivisions = serverContainer.get<GetCoreTeamDivisions>(
      SYMBOLS.GetCoreTeamDivisions,
    );

    const [coreTeamMemberResult, coreTeamDivisionsResult] = await Promise.all([
      cache(
        async () => await getCoreTeamMember.execute(memberId, ['membership.core_team_division']),
      )(),
      getCoreTeamDivisions.execute(undefined, undefined, { perPage: 100 }),
    ]);

    const [coreTeamDivisions] = match(coreTeamDivisionsResult, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });
    const coreTeamMember = match(coreTeamMemberResult, {
      onLeft: (error) => {
        if (error instanceof NotFoundError) {
          notFound();
        } else {
          throw error;
        }
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
          {
            label: coreTeamMember.name,
            url: `/core-teams/${coreTeamId}/members/${coreTeamMember.id}`,
          },
          { label: 'Edit', url: `/core-teams/${coreTeamId}/members/${coreTeamMember.id}/edit` },
        ]}
      >
        <CoreTeamMemberForm
          coreTeam={CoreTeamMapper.fromDomainToDto(coreTeam) as CoreTeamDto}
          initialCoreTeamMember={
            CoreTeamMemberMapper.fromDomainToDto(coreTeamMember) as CoreTeamMemberDto
          }
          coreTeamDivisions={
            coreTeamDivisions.map(CoreTeamDivisionMapper.fromDomainToDto) as CoreTeamDivisionDto[]
          }
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
