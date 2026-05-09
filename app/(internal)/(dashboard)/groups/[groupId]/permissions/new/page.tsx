import { GroupPermissionForm } from '@app/presentation/components/internal/single-group-permission';

type Props = {
  params: Promise<{
    groupId: string;
  }>;
};

export default async function SingleGroupPermissionNewPage({ params }: Props) {
  const groupId = (await params).groupId;

  return <GroupPermissionForm groupId={groupId} />;
}
