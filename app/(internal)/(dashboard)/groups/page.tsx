import { GetGroups, GetSession } from '@app/application';
import {
  GroupDto,
  GroupMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { GroupsList, GroupsToolbar } from '@app/presentation/components/internal/groups';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export default async function GroupsPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['read-group'].some((p) => userPermissions.has(p))) {
    const getGroups = serverContainer.get<GetGroups>(SYMBOLS.GetGroups);

    const result = await getGroups.execute(undefined, { perPage: 25 });
    const [groups, paginationOptions] = match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title="Groups">
          <GroupsToolbar />
        </SectionHeader>
        <GroupsList
          initialGroups={groups.map(GroupMapper.fromDomainToDto) as GroupDto[]}
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
          }
        />
      </>
    );
  } else {
    notFound();
  }
}
