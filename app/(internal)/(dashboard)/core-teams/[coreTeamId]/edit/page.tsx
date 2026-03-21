import { GetCoreTeam } from '@app/application';
import { match } from 'effect/Either';
import { CoreTeamDto, CoreTeamMapper } from '@app/infrastructure/dtos';
import { CoreTeamForm } from '@app/presentation/components/internal/single-core-team';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { NotFoundError } from '@app/domain/errors';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    coreTeamId: string;
  }>;
};

export default async function SingleCoreTeamEditPage({ params }: Props) {
  const getCoreTeam = serverContainer.get<GetCoreTeam>(SYMBOLS.GetCoreTeam);
  const coreTeamId = (await params).coreTeamId;

  const coreTeamResult = await getCoreTeam.execute(coreTeamId);
  const coreTeam = match(coreTeamResult, {
    onLeft: (error) => {
      if (error instanceof NotFoundError) {
        notFound();
      } else {
        throw error;
      }
    },
    onRight: (data) => data,
  });

  return <CoreTeamForm initialCoreTeam={CoreTeamMapper.fromDomaintoDto(coreTeam) as CoreTeamDto} />;
}
