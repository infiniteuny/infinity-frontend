import { CommunityGroupMemberForm } from '@app/presentation/components/internal/single-community-group-member';

type Props = {
  params: Promise<{
    communityGroupId: string;
  }>;
};

export default async function SingleCommunityGroupMemberNewPage({ params }: Props) {
  const communityGroupId = (await params).communityGroupId;

  return <CommunityGroupMemberForm communityGroupId={communityGroupId} />;
}
