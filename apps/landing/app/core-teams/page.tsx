import {
  CoreTeamDto,
  CoreTeamMapper,
  CoreTeamMemberDto,
  CoreTeamMemberMapper,
} from '@infiniteuny/infinity-infrastructure';
import { CoreTeamsView } from '@app/presentation/components/core-teams';
import { GetCoreTeamMembers, GetCoreTeams } from '@infiniteuny/infinity-application';
import { isRight } from 'effect/Either';
import { Main } from '@app/presentation/components/shared';
import { Metadata } from 'next';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tim Pengurus',
  description:
    'Direktori pengurus inti komunitas Teknologi Informasi INFINITE Universitas Negeri Yogyakarta.',
};

type Props = {
  searchParams: Promise<{ year?: string }>;
};

export default async function CoreTeamsPage({ searchParams }: Props) {
  const { year } = await searchParams;
  const getCoreTeams = serverContainer.get<GetCoreTeams>(SYMBOLS.GetCoreTeams);
  const getCoreTeamMembers = serverContainer.get<GetCoreTeamMembers>(SYMBOLS.GetCoreTeamMembers);

  const coreTeamsResult = await getCoreTeams.execute(
    undefined,
    { year: 'DESC' },
    { perPage: 20 },
    undefined,
    false,
  );

  const coreTeams = isRight(coreTeamsResult) ? coreTeamsResult.right[0] : [];
  const selectedCoreTeam =
    (year ? coreTeams.find((t) => String(t.year) === year) : undefined) ??
    coreTeams.find((t) => t.isActive) ??
    coreTeams[0];

  let members: CoreTeamMemberDto[] = [];
  if (selectedCoreTeam) {
    const membersResult = await getCoreTeamMembers.execute(
      selectedCoreTeam.id,
      ['major', 'major.degree', 'major.faculty', 'membership.core_team_division'],
      undefined,
      undefined,
      { perPage: 100 },
      undefined,
      false,
    );

    if (isRight(membersResult)) {
      const sorted = [...membersResult.right[0]].sort((a, b) => {
        const prioA = a.membership?.coreTeamDivision?.priority ?? 999;
        const prioB = b.membership?.coreTeamDivision?.priority ?? 999;
        return prioA - prioB;
      });
      members = sorted.map((m) => CoreTeamMemberMapper.fromDomainToDto(m) as CoreTeamMemberDto);
    }
  }

  return (
    <Main>
      <CoreTeamsView
        coreTeams={coreTeams.map((t) => CoreTeamMapper.fromDomainToDto(t) as CoreTeamDto)}
        selectedCoreTeam={
          selectedCoreTeam
            ? (CoreTeamMapper.fromDomainToDto(selectedCoreTeam) as CoreTeamDto)
            : undefined
        }
        members={members}
      />
    </Main>
  );
}
