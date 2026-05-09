import { GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { UserPermissionForm } from '@app/presentation/components/internal/single-user-permission';

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function SingleUserPermissionNewPage({ params }: Props) {
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

  if (['create-user-permission'].some((p) => userPermissions.has(p))) {
    return <UserPermissionForm userId={userId} />;
  } else {
    notFound();
  }
}
