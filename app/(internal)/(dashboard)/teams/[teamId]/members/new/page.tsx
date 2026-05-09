import { TeamMemberForm } from '@app/presentation/components/internal/single-team-member';

type Props = {
  params: Promise<{
    teamId: string;
  }>;
};

export default async function SingleTeamMemberNewPage({ params }: Props) {
  const teamId = (await params).teamId;

  return <TeamMemberForm teamId={teamId} />;
}
