import { UserGroupForm } from '@app/presentation/components/internal/single-user-group';

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function NewUserGroupPage({ params }: Props) {
  const userId = (await params).userId;

  return <UserGroupForm userId={userId} />;
}
