import { GetCommunityGroup } from '@app/application';
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
        CommunityGroupMapper.fromDomaintoDto(communityGroup) as CommunityGroupDto
      }
    />
  );
}
