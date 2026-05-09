import { GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { UserCommunityGroupForm } from '@app/presentation/components/internal/single-user-community-group';

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function SigleUserCommunityGroupNewPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const userId = (await params).userId;

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (
    ['create-community-group-member'].some((p) => userPermissions.has(p)) ||
    (['create-own-community-group-member'].some((p) => userPermissions.has(p)) &&
      userId === session.user.id)
  ) {
    return <UserCommunityGroupForm userId={userId} />;
  } else {
    notFound();
  }
}
