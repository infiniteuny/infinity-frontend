import { GetCommunityGroupAdmin } from '@app/application';
import { match } from 'effect/Either';
import { CommunityGroupAdminDto, CommunityGroupAdminMapper } from '@app/infrastructure/dtos';
import { CommunityGroupAdminForm } from '@app/presentation/components/internal/single-community-group-admin';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { NotFoundError } from '@app/domain/errors';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    communityGroupAdminId: string;
  }>;
};

export default async function SingleCommunityGroupAdminEditPage({ params }: Props) {
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
        CommunityGroupAdminMapper.fromDomaintoDto(communityGroupAdmin) as CommunityGroupAdminDto
      }
    />
  );
}
