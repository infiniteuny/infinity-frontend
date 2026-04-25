import { GetCommunityGroup } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CommunityGroupDto, CommunityGroupMapper } from '@app/infrastructure/dtos';
import {
  CommunityGroupForm,
  CommunityGroupToolbar,
  CommunityGroupView,
} from '@app/presentation/components/internal/single-community-group';

type Props = {
  params: Promise<{
    communityGroupId: string;
  }>;
};

export default async function SingleCommunityGroupPage({ params }: Props) {
  const communityGroupId = (await params).communityGroupId;

  if (communityGroupId !== 'new') {
    const getCommunityGroup = serverContainer.get<GetCommunityGroup>(SYMBOLS.GetCommunityGroup);
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
      <>
        <SectionHeader title={communityGroup.name}>
          <CommunityGroupToolbar communityGroupId={communityGroup.id} />
        </SectionHeader>
        <CommunityGroupView
          initialCommunityGroup={
            CommunityGroupMapper.fromDomaintoDto(communityGroup) as CommunityGroupDto
          }
        />
      </>
    );
  } else {
    return <CommunityGroupForm />;
  }
}
