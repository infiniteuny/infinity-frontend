import { cache } from 'react';
import {
  CoreTeamDivisionDto,
  CoreTeamDivisionMapper,
  CoreTeamDto,
  CoreTeamMapper,
  CoreTeamMemberDto,
  CoreTeamMemberMapper,
} from '@app/infrastructure/dtos';
import {
  CoreTeamMemberForm,
  CoreTeamMemberToolbar,
  CoreTeamMemberView,
} from '@app/presentation/components/internal/single-core-team-member';
import { GetCoreTeam, GetCoreTeamDivisions, GetCoreTeamMember, GetSession } from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
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
    memberId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const { coreTeamId, memberId } = await params;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (memberId !== 'new') {
    const getCoreTeamMember = serverContainer.get<GetCoreTeamMember>(SYMBOLS.GetCoreTeamMember);

    const coreTeamMemberResult = await cache(
      async () => await getCoreTeamMember.execute(memberId),
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
      title: coreTeamMember.name,
    };
  } else if (
    memberId === 'new' &&
    ['create-core-team-member'].some((p) => userPermissions.has(p))
  ) {
    const getCoreTeam = serverContainer.get<GetCoreTeam>(SYMBOLS.GetCoreTeam);

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
      title: `Add ${coreTeam.year}'s Member`,
    };
  } else {
    notFound();
  }
}

export default async function SingleCoreTeamMemberPage({ params }: Props) {
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

  if (memberId !== 'new') {
    const getCoreTeamMember = serverContainer.get<GetCoreTeamMember>(SYMBOLS.GetCoreTeamMember);

    const coreTeamMemberResult = await cache(
      async () =>
        await getCoreTeamMember.execute(memberId, [
          'major',
          'major.faculty',
          'membership.core_team_division',
        ]),
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
        ]}
      >
        <SectionHeader title={coreTeamMember.name} backUrl={`/core-teams/${coreTeamId}/members`}>
          <CoreTeamMemberToolbar coreTeamId={coreTeamId} coreTeamMemberId={coreTeamMember.id} />
        </SectionHeader>
        <CoreTeamMemberView
          initialCoreTeamMember={
            CoreTeamMemberMapper.fromDomainToDto(coreTeamMember) as CoreTeamMemberDto
          }
        />
      </InternalMain>
    );
  } else if (
    memberId === 'new' &&
    ['create-core-team-member'].some((p) => userPermissions.has(p))
  ) {
    const getCoreTeamDivisions = serverContainer.get<GetCoreTeamDivisions>(
      SYMBOLS.GetCoreTeamDivisions,
    );

    const coreTeamDivisionsResult = await getCoreTeamDivisions.execute(undefined, undefined, {
      perPage: 100,
    });
    const [coreTeamDivisions] = match(coreTeamDivisionsResult, {
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
          { label: 'Add', url: `/core-teams/${coreTeamId}/members/new` },
        ]}
      >
        <CoreTeamMemberForm
          coreTeam={CoreTeamMapper.fromDomainToDto(coreTeam) as CoreTeamDto}
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
