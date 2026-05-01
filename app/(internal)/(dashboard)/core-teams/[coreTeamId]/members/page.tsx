import { GetCoreTeamMembers } from '@app/application';
import { match } from 'effect/Either';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  CoreTeamMemberDto,
  CoreTeamMemberMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  CoreTeamMembersList,
  CoreTeamMembersToolbar,
} from '@app/presentation/components/internal/core-team-members';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    coreTeamId: string;
  }>;
};

export default async function CoreTeamMembersPage({ params }: Props) {
  const getCoreTeamMembers = serverContainer.get<GetCoreTeamMembers>(SYMBOLS.GetCoreTeamMembers);
  const coreTeamId = (await params).coreTeamId;
  const result = await getCoreTeamMembers.execute(
    coreTeamId,
    ['major', 'major.faculty', 'membership.core_team_division'],
    undefined,
    {
      perPage: 25,
    },
  );
  const [coreTeamMembers, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="Core Team Members">
        <CoreTeamMembersToolbar coreTeamId={coreTeamId} />
      </SectionHeader>
      <CoreTeamMembersList
        coreTeamId={coreTeamId}
        initialCoreTeamMembers={
          coreTeamMembers.map(CoreTeamMemberMapper.fromDomainToDto) as CoreTeamMemberDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
