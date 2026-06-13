import { cache } from 'react';
import { GetUser, GetUserPersonas } from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  UserPersonaDto,
  UserPersonaMapper,
} from '@app/infrastructure/dtos';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  UserPersonasList,
  UserPersonasToolbar,
} from '@app/presentation/components/internal/user-personas';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);
  const userId = (await params).userId;

  const userResult = await cache(async () => await getUser.execute(userId))();
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

  return {
    title: `${user.name}'s Personas`,
  };
}

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function UserPersonasPage({ params }: Props) {
  const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);
  const getUserPersonas = serverContainer.get<GetUserPersonas>(SYMBOLS.GetUserPersonas);
  const userId = (await params).userId;

  const [userResult, userPersonasResult] = await Promise.all([
    cache(async () => await getUser.execute(userId))(),
    getUserPersonas.execute(userId, undefined, undefined, { perPage: 25 }),
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
  const [userPersonas, paginationOptions] = match(userPersonasResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <InternalMain
      breadcrumbs={[
        { label: 'Overview', url: '/' },
        { label: 'Users', url: '/users' },
        { label: user.name, url: `/users/${userId}` },
        { label: 'Personas', url: `/users/${userId}/personas` },
      ]}
    >
      <SectionHeader title={`${user.name}'s Personas`} backUrl={`/users/${userId}`}>
        <UserPersonasToolbar userId={userId} />
      </SectionHeader>
      <UserPersonasList
        userId={userId}
        initialUserPersonas={
          userPersonas.map(UserPersonaMapper.fromDomainToDto) as UserPersonaDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </InternalMain>
  );
}
