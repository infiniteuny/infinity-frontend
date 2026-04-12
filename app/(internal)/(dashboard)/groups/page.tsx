import { GetGroups } from '@app/application';
import { match } from 'effect/Either';
import {
  GroupDto,
  GroupMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { GroupsList, GroupsToolbar } from '@app/presentation/components/internal/groups';

export const dynamic = 'force-dynamic';

export default async function GroupsPage() {
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
        initialGroups={groups.map(GroupMapper.fromDomaintoDto) as GroupDto[]}
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomaintoDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
