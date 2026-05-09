import { GetSession, GetTeam } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { TeamMemberForm } from '@app/presentation/components/internal/single-team-member';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    teamId: string;
  }>;
};

export default async function SingleTeamMemberNewPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getTeam = serverContainer.get<GetTeam>(SYMBOLS.GetTeam);
  const teamId = (await params).teamId;

  const [teamResult, sessionResult] = await Promise.all([
    getTeam.execute(teamId, ['members']),
    getSession.execute(),
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
    return <TeamMemberForm teamId={teamId} />;
  } else {
    notFound();
  }
}
