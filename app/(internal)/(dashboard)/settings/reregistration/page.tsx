import { DateTime } from 'luxon';
import { GetConfig, GetSession, GetUser } from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { ReregistrationView } from '@app/presentation/components/internal/reregistration';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { UserDto, UserMapper } from '@app/infrastructure/dtos';

export const metadata: Metadata = {
  title: 'Re-registration',
};

export default async function ReregistrationPage() {
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

  if (user.isMember) {
    const getConfig = serverContainer.get<GetConfig>(SYMBOLS.GetConfig);

    const [
      allowReregistrationResult,
      allowExpiredReregistrationResult,
      startReregistrationDateResult,
      endReregistrationDateResult,
    ] = await Promise.all([
      getConfig.execute('allow_reregistration'),
      getConfig.execute('allow_expired_reregistration'),
      getConfig.execute('start_reregistration_date'),
      getConfig.execute('end_reregistration_date'),
    ]);

    const allowReregistration = match(allowReregistrationResult, {
      onLeft: () => false,
      onRight: (data) => data.value === 'true',
    });
    const allowExpiredReregistration = match(allowExpiredReregistrationResult, {
      onLeft: () => false,
      onRight: (data) => data.value === 'true',
    });
    const startReregistrationDate = match(startReregistrationDateResult, {
      onLeft: (error) => {
        console.log(error);
        return null;
      },
      onRight: (data) => DateTime.fromISO(data.value, { zone: 'UTC' }).toJSDate(),
    });
    const endReregistrationDate = match(endReregistrationDateResult, {
      onLeft: () => null,
      onRight: (data) => DateTime.fromISO(data.value, { zone: 'UTC' }).toJSDate(),
    });

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Settings', url: '/settings' },
          { label: 'Re-registration', url: '/settings/reregistration' },
        ]}
      >
        <SectionHeader title="Re-registration" backUrl="/settings" />
        <ReregistrationView
          user={UserMapper.fromDomainToDto(user) as UserDto}
          allowReregistration={allowReregistration}
          allowExpiredReregistration={allowExpiredReregistration}
          startReregistrationDate={startReregistrationDate}
          endReregistrationDate={endReregistrationDate}
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
