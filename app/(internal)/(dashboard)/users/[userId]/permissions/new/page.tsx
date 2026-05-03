import { UserPermissionForm } from '@app/presentation/components/internal/single-user-permission';

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function NewUserPermissionPage({ params }: Props) {
  const userId = (await params).userId;

  return <UserPermissionForm userId={userId} />;
}
