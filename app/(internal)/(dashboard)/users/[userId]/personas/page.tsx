import { GetUserPersonas } from '@app/application';
import { match } from 'effect/Either';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  UserPersonaDto,
  UserPersonaMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  UserPersonasList,
  UserPersonasToolbar,
} from '@app/presentation/components/internal/user-personas';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function UserPersonasPage({ params }: Props) {
  const getUserPersonas = serverContainer.get<GetUserPersonas>(SYMBOLS.GetUserPersonas);
  const userId = (await params).userId;
  const result = await getUserPersonas.execute(userId, undefined, { perPage: 25 });
  const [userPersonas, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="User Personas">
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
    </>
  );
}
