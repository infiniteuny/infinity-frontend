import { GetGroup, GetSession } from '@app/application';
import { GroupPermissionForm } from '@app/presentation/components/internal/single-group-permission';
import { isLeft, match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    groupId: string;
  }>;
};

export default async function SingleGroupPermissionNewPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getGroup = serverContainer.get<GetGroup>(SYMBOLS.GetGroup);
  const groupId = (await params).groupId;

  const [groupResult, sessionResult] = await Promise.all([
    getGroup.execute(groupId),
    getSession.execute(),
  ]);

  if (isLeft(groupResult)) {
    const error = groupResult.left;

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

  if (['create-group-permission'].some((p) => userPermissions.has(p))) {
    return <GroupPermissionForm groupId={groupId} />;
  } else {
    notFound();
  }
}
