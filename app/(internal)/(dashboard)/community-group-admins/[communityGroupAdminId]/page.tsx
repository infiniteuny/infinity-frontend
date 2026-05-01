import { CommunityGroupAdminDto, CommunityGroupAdminMapper } from '@app/infrastructure/dtos';
import {
  CommunityGroupAdminForm,
  CommunityGroupAdminToolbar,
  CommunityGroupAdminView,
} from '@app/presentation/components/internal/single-community-group-admin';
import { GetCommunityGroupAdmin } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    communityGroupAdminId: string;
  }>;
};

export default async function SingleCommunityGroupAdminPage({ params }: Props) {
  const communityGroupAdminId = (await params).communityGroupAdminId;

  if (communityGroupAdminId !== 'new') {
    const getCommunityGroupAdmin = serverContainer.get<GetCommunityGroupAdmin>(
      SYMBOLS.GetCommunityGroupAdmin,
    );
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
      <>
        <SectionHeader title={communityGroupAdmin.year.toString()}>
          <CommunityGroupAdminToolbar communityGroupAdminId={communityGroupAdmin.id} />
        </SectionHeader>
        <CommunityGroupAdminView
          initialCommunityGroupAdmin={
            CommunityGroupAdminMapper.fromDomainToDto(communityGroupAdmin) as CommunityGroupAdminDto
          }
        />
      </>
    );
  } else {
    return <CommunityGroupAdminForm />;
  }
}
