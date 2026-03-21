'use client';

import { CommunityGroupAdminDto, CommunityGroupAdminMapper } from '@app/infrastructure/dtos';
import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';

type Props = {
  initialCommunityGroupAdmin: CommunityGroupAdminDto;
};

export function CommunityGroupAdminView({ initialCommunityGroupAdmin }: Props) {
  const communityGroupAdmin = CommunityGroupAdminMapper.fromDtoToDomain(initialCommunityGroupAdmin);

  return (
    <>
      <GeneralView communityGroupAdmin={communityGroupAdmin} />
      <MetadataView communityGroupAdmin={communityGroupAdmin} />
    </>
  );
}
