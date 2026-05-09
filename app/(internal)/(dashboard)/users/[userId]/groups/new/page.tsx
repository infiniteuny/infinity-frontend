import { GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { UserGroupForm } from '@app/presentation/components/internal/single-user-group';

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function SingleUserGroupNewPage({ params }: Props) {
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

  if (['create-user-group'].some((p) => userPermissions.has(p))) {
    return <UserGroupForm userId={userId} />;
  } else {
    notFound();
  }
}
