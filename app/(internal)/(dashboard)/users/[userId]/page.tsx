import { GetUser } from '@app/application';
import { match } from 'effect/Either';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { User } from '@app/domain/entities';
import { UserDto, UserMapper } from '@app/infrastructure/dtos';
import { UserForm, UserView } from '@app/presentation/components/internal/single-user';

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function SingleUserPage({ params }: Props) {
  const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);
  const userId = (await params).userId;

  let user: User | undefined;
  if (userId !== 'new') {
    const result = await getUser.execute(userId, ['major']);
    user = match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });
  }

  if (user) {
    return (
      <>
        <SectionHeader title={user.name} />
        <UserView initialUser={UserMapper.fromDomaintoDto(user) as UserDto} />
      </>
    );
  } else {
    return (
      <>
        <SectionHeader title="Create User" />
        <UserForm />
      </>
    );
  }
}
