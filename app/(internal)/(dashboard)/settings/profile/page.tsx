import { GetSession, GetUser } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { ProfileToolbar } from '@app/presentation/components/internal/profile';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { UserDto, UserMapper } from '@app/infrastructure/dtos';
import { UserView } from '@app/presentation/components/internal/single-user';

export default async function ProfilePage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });

  const userResult = await getUser.execute(session.user.id, [
    'major',
    'major.faculty',
    'major.degree',
  ]);
  const user = match(userResult, {
    onLeft: (error) => {
      if (error instanceof NotFoundError) {
        notFound();
      } else {
        throw error;
      }
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="Profile">
        <ProfileToolbar userId={user.id} />
      </SectionHeader>
      <UserView initialUser={UserMapper.fromDomainToDto(user) as UserDto} />
    </>
  );
}
