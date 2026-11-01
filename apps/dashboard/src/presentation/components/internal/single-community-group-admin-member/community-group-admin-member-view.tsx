'use client';

import {
  CommunityGroupAdminMemberDto,
  CommunityGroupAdminMemberMapper,
} from '@infiniteuny/infinity-infrastructure';
import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';

type Props = {
  initialCommunityGroupAdminMember: CommunityGroupAdminMemberDto;
};

export function CommunityGroupAdminMemberView({ initialCommunityGroupAdminMember }: Props) {
  const communityGroupAdminMember = CommunityGroupAdminMemberMapper.fromDtoToDomain(
    initialCommunityGroupAdminMember,
  );

  return (
    <>
      <GeneralView communityGroupAdminMember={communityGroupAdminMember} />
      <MetadataView communityGroupAdminMember={communityGroupAdminMember} />
    </>
  );
}
