'use client';

import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';
import { CommunityGroupDto, CommunityGroupMapper } from '@app/infrastructure/dtos';

type Props = {
  initialCommunityGroup: CommunityGroupDto;
};

export function CommunityGroupView({ initialCommunityGroup }: Props) {
  const communityGroup = CommunityGroupMapper.fromDtoToDomain(initialCommunityGroup);

  return (
    <>
      <GeneralView communityGroup={communityGroup} />
      <MetadataView communityGroup={communityGroup} />
    </>
  );
}
