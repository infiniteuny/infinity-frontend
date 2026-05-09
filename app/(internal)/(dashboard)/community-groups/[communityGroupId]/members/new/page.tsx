import { CommunityGroupMemberForm } from '@app/presentation/components/internal/single-community-group-member';
import { GetCommunityGroup, GetSession } from '@app/application';
import { isLeft, match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    communityGroupId: string;
  }>;
};

export default async function SingleCommunityGroupMemberNewPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getCommunityGroup = serverContainer.get<GetCommunityGroup>(SYMBOLS.GetCommunityGroup);
  const communityGroupId = (await params).communityGroupId;

  const [communityGroupResult, sessionResult] = await Promise.all([
    getCommunityGroup.execute(communityGroupId),
    getSession.execute(),
  ]);

  if (isLeft(communityGroupResult)) {
    const error = communityGroupResult.left;

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

  if (['create-community-group-member'].some((p) => userPermissions.has(p))) {
    return <CommunityGroupMemberForm communityGroupId={communityGroupId} />;
  } else {
    notFound();
  }
}
