import { UserCommunityGroupForm } from '@app/presentation/components/internal/single-user-community-group';

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function SigleUserCommunityGroupNewPage({ params }: Props) {
  const userId = (await params).userId;

  return <UserCommunityGroupForm userId={userId} />;
}
