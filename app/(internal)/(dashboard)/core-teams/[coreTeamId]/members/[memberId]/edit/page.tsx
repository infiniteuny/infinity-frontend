import {
  CoreTeamDivisionDto,
  CoreTeamDivisionMapper,
  CoreTeamMemberDto,
  CoreTeamMemberMapper,
} from '@app/infrastructure/dtos';
import { CoreTeamMemberForm } from '@app/presentation/components/internal/single-core-team-member';
import { GetCoreTeamDivisions, GetCoreTeamMember } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    coreTeamId: string;
    memberId: string;
  }>;
};

export default async function SingleCoreTeamMemberEditPage({ params }: Props) {
  const { coreTeamId, memberId } = await params;

  const getCoreTeamMember = serverContainer.get<GetCoreTeamMember>(SYMBOLS.GetCoreTeamMember);
  const getCoreTeamDivisions = serverContainer.get<GetCoreTeamDivisions>(
    SYMBOLS.GetCoreTeamDivisions,
  );

  const [coreTeamMemberResult, coreTeamDivisionsResult] = await Promise.all([
    getCoreTeamMember.execute(memberId, ['membership.core_team_division']),
    getCoreTeamDivisions.execute(undefined, { perPage: 100 }),
  ]);

  const [coreTeamDivisions] = match(coreTeamDivisionsResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });
  const coreTeamMember = match(coreTeamMemberResult, {
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
    <CoreTeamMemberForm
      coreTeamId={coreTeamId}
      initialCoreTeamMember={
        CoreTeamMemberMapper.fromDomainToDto(coreTeamMember) as CoreTeamMemberDto
      }
      coreTeamDivisions={
        coreTeamDivisions.map(CoreTeamDivisionMapper.fromDomainToDto) as CoreTeamDivisionDto[]
      }
    />
  );
}
