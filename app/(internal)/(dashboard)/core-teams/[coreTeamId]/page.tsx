import { CoreTeamDto, CoreTeamMapper } from '@app/infrastructure/dtos';
import {
  CoreTeamForm,
  CoreTeamToolbar,
  CoreTeamView,
} from '@app/presentation/components/internal/single-core-team';
import { GetCoreTeam } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    coreTeamId: string;
  }>;
};

export default async function SingleCoreTeamPage({ params }: Props) {
  const coreTeamId = (await params).coreTeamId;

  if (coreTeamId !== 'new') {
    const getCoreTeam = serverContainer.get<GetCoreTeam>(SYMBOLS.GetCoreTeam);
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

    return (
      <>
        <SectionHeader title={coreTeam.year.toString()}>
          <CoreTeamToolbar coreTeamId={coreTeam.id} />
        </SectionHeader>
        <CoreTeamView initialCoreTeam={CoreTeamMapper.fromDomaintoDto(coreTeam) as CoreTeamDto} />
      </>
    );
  } else {
    return <CoreTeamForm />;
  }
}
