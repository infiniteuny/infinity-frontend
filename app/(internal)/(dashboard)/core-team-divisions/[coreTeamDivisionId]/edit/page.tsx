import { GetCoreTeamDivision, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CoreTeamDivisionDto, CoreTeamDivisionMapper } from '@app/infrastructure/dtos';
import { CoreTeamDivisionForm } from '@app/presentation/components/internal/single-core-team-division';

type Props = {
  params: Promise<{
    coreTeamDivisionId: string;
  }>;
};

export default async function SingleCoreTeamDivisionEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();

  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-core-team-division'].some((p) => userPermissions.has(p))) {
    const getCoreTeamDivision = serverContainer.get<GetCoreTeamDivision>(
      SYMBOLS.GetCoreTeamDivision,
    );
    const coreTeamDivisionId = (await params).coreTeamDivisionId;

    const coreTeamDivisionResult = await getCoreTeamDivision.execute(coreTeamDivisionId);
    const coreTeamDivision = match(coreTeamDivisionResult, {
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
      <CoreTeamDivisionForm
        initialCoreTeamDivision={
          CoreTeamDivisionMapper.fromDomainToDto(coreTeamDivision) as CoreTeamDivisionDto
        }
      />
    );
  } else {
    notFound();
  }
}
