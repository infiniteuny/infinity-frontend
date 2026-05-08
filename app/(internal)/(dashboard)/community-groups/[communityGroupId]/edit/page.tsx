import { GetCommunityGroup, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CommunityGroupDto, CommunityGroupMapper } from '@app/infrastructure/dtos';
import { CommunityGroupForm } from '@app/presentation/components/internal/single-community-group';

type Props = {
  params: Promise<{
    communityGroupId: string;
  }>;
};

export default async function SingleCommunityGroupEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();

  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-community-group'].some((p) => userPermissions.has(p))) {
    const getCommunityGroup = serverContainer.get<GetCommunityGroup>(SYMBOLS.GetCommunityGroup);
    const communityGroupId = (await params).communityGroupId;

    const communityGroupResult = await getCommunityGroup.execute(communityGroupId);
    const communityGroup = match(communityGroupResult, {
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
      <CommunityGroupForm
        initialCommunityGroup={
          CommunityGroupMapper.fromDomainToDto(communityGroup) as CommunityGroupDto
        }
      />
    );
  } else {
    notFound();
  }
}
