import { GetCoreTeamDivision, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CoreTeamDivisionDto, CoreTeamDivisionMapper } from '@app/infrastructure/dtos';
import {
  CoreTeamDivisionForm,
  CoreTeamDivisionToolbar,
  CoreTeamDivisionView,
} from '@app/presentation/components/internal/single-core-team-division';

type Props = {
  params: Promise<{
    coreTeamDivisionId: string;
  }>;
};

export default async function SingleCoreTeamDivisionPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const coreTeamDivisionId = (await params).coreTeamDivisionId;

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (
    coreTeamDivisionId !== 'new' &&
    ['read-core-team-division'].some((p) => userPermissions.has(p))
  ) {
    const getCoreTeamDivision = serverContainer.get<GetCoreTeamDivision>(
      SYMBOLS.GetCoreTeamDivision,
    );
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
      <>
        <SectionHeader title={coreTeamDivision.name}>
          <CoreTeamDivisionToolbar coreTeamDivisionId={coreTeamDivision.id} />
        </SectionHeader>
        <CoreTeamDivisionView
          initialCoreTeamDivision={
            CoreTeamDivisionMapper.fromDomainToDto(coreTeamDivision) as CoreTeamDivisionDto
          }
        />
      </>
    );
  } else if (
    coreTeamDivisionId === 'new' &&
    ['create-core-team-division'].some((p) => userPermissions.has(p))
  ) {
    return <CoreTeamDivisionForm />;
  } else {
    notFound();
  }
}
