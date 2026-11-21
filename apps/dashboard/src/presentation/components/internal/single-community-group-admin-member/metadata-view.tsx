import { CommunityGroupAdminMember } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  communityGroupAdminMember: CommunityGroupAdminMember;
};

export function MetadataView({ communityGroupAdminMember }: Props) {
  return (
    <EntityMetadataView
      id={communityGroupAdminMember.membership.id}
      createdAt={communityGroupAdminMember.membership.createdAt}
      updatedAt={communityGroupAdminMember.membership.updatedAt}
      extraItems={[
        { title: 'User ID', subtitle: communityGroupAdminMember.membership.userId },
        {
          title: 'Community Group ID',
          subtitle: communityGroupAdminMember.membership.communityGroupId,
        },
      ]}
    />
  );
}
