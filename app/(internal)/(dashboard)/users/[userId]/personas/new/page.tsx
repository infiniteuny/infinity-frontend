import { UserPersonaForm } from '@app/presentation/components/internal/single-user-persona';

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function NewUserPersonaPage({ params }: Props) {
  const userId = (await params).userId;

  return <UserPersonaForm userId={userId} />;
}
