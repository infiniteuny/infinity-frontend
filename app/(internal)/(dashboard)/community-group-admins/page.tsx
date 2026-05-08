import { GetCommunityGroupAdmins, GetSession } from '@app/application';
import { match } from 'effect/Either';
import {
  CommunityGroupAdminDto,
  CommunityGroupAdminMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  CommunityGroupAdminsList,
  CommunityGroupAdminsToolbar,
} from '@app/presentation/components/internal/community-group-admins';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CommunityGroupAdminsPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (!['read-community-group-admin'].some((p) => userPermissions.has(p))) {
    notFound();
  } else {
    const getCommunityGroupAdmins = serverContainer.get<GetCommunityGroupAdmins>(
      SYMBOLS.GetCommunityGroupAdmins,
    );

    const result = await getCommunityGroupAdmins.execute(undefined, { perPage: 25 });
    const [communityGroupAdmins, paginationOptions] = match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title="Community Group Administrators">
          <CommunityGroupAdminsToolbar />
        </SectionHeader>
        <CommunityGroupAdminsList
          initialCommunityGroupAdmins={
            communityGroupAdmins.map(
              CommunityGroupAdminMapper.fromDomainToDto,
            ) as CommunityGroupAdminDto[]
          }
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
          }
        />
      </>
    );
  }
}
