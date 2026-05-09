import { CommunityGroupAdminDto, CommunityGroupAdminMapper } from '@app/infrastructure/dtos';
import { CommunityGroupAdminForm } from '@app/presentation/components/internal/single-community-group-admin';
import { GetCommunityGroupAdmin, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    communityGroupAdminId: string;
  }>;
};

export default async function SingleCommunityGroupAdminEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-community-group-admin'].some((p) => userPermissions.has(p))) {
    const getCommunityGroupAdmin = serverContainer.get<GetCommunityGroupAdmin>(
      SYMBOLS.GetCommunityGroupAdmin,
    );
    const communityGroupAdminId = (await params).communityGroupAdminId;

    const communityGroupAdminResult = await getCommunityGroupAdmin.execute(communityGroupAdminId);
    const communityGroupAdmin = match(communityGroupAdminResult, {
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
      <CommunityGroupAdminForm
        initialCommunityGroupAdmin={
          CommunityGroupAdminMapper.fromDomainToDto(communityGroupAdmin) as CommunityGroupAdminDto
        }
      />
    );
  } else {
    notFound();
  }
}
