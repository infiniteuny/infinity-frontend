import {
  CommunityGroupDto,
  CommunityGroupMapper,
  CoreTeamDto,
  CoreTeamMapper,
  CoreTeamMemberDto,
  CoreTeamMemberMapper,
  PersonaDto,
  PersonaMapper,
  ProjectGalleryDto,
  ProjectGalleryMapper,
  TestimonialDto,
  TestimonialMapper,
} from '@infiniteuny/infinity-infrastructure';
import {
  GetAchievements,
  GetCommunityGroups,
  GetCoreTeamMembers,
  GetCoreTeams,
  GetPersonas,
  GetProjectGalleries,
  GetTestimonials,
  GetUsers,
} from '@infiniteuny/infinity-application';
import { HomeView } from '@app/presentation/components/home';
import { isRight } from 'effect/Either';
import { Main } from '@app/presentation/components/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const getCoreTeams = serverContainer.get<GetCoreTeams>(SYMBOLS.GetCoreTeams);
  const getCoreTeamMembers = serverContainer.get<GetCoreTeamMembers>(SYMBOLS.GetCoreTeamMembers);
  const getPersonas = serverContainer.get<GetPersonas>(SYMBOLS.GetPersonas);
  const getCommunityGroups = serverContainer.get<GetCommunityGroups>(SYMBOLS.GetCommunityGroups);
  const getProjectGalleries = serverContainer.get<GetProjectGalleries>(SYMBOLS.GetProjectGalleries);
  const getTestimonials = serverContainer.get<GetTestimonials>(SYMBOLS.GetTestimonials);
  const getUsers = serverContainer.get<GetUsers>(SYMBOLS.GetUsers);
  const getAchievements = serverContainer.get<GetAchievements>(SYMBOLS.GetAchievements);

  const [
    coreTeamsResult,
    personasResult,
    communityGroupsResult,
    projectGalleriesResult,
    testimonialsResult,
    usersResult,
    achievementsResult,
  ] = await Promise.all([
    getCoreTeams.execute(undefined, { year: 'DESC' }, { perPage: 20 }, undefined, false),
    getPersonas.execute(undefined, { priority: 'ASC' }, { perPage: 20 }, undefined, false),
    getCommunityGroups.execute(
      { isActive: true },
      { priority: 'ASC' },
      { perPage: 20 },
      undefined,
      false,
    ),
    getProjectGalleries.execute(
      undefined,
      { createdAt: 'DESC' },
      { perPage: 12 },
      undefined,
      false,
    ),
    getTestimonials.execute(undefined, { createdAt: 'DESC' }, { perPage: 12 }, undefined, false),
    getUsers.execute(undefined, { isMember: true }, undefined, { perPage: 500 }, undefined, false),
    getAchievements.execute(
      undefined,
      { status: 'ACCEPTED' },
      undefined,
      { perPage: 500 },
      undefined,
      false,
    ),
  ]);

  const coreTeams = isRight(coreTeamsResult) ? coreTeamsResult.right[0] : [];
  const activeCoreTeam = coreTeams.find((team) => team.isActive) ?? coreTeams[0];

  let coreTeamMembers: CoreTeamMemberDto[] = [];
  if (activeCoreTeam) {
    const membersResult = await getCoreTeamMembers.execute(
      activeCoreTeam.id,
      ['major', 'major.degree', 'major.faculty', 'membership.core_team_division'],
      undefined,
      undefined,
      { perPage: 100 },
      undefined,
      false,
    );
    if (isRight(membersResult)) {
      const sortedMembers = [...membersResult.right[0]].sort((a, b) => {
        const prioA = a.membership?.coreTeamDivision?.priority ?? 999;
        const prioB = b.membership?.coreTeamDivision?.priority ?? 999;
        return prioA - prioB;
      });
      coreTeamMembers = sortedMembers.map(
        (m) => CoreTeamMemberMapper.fromDomainToDto(m) as CoreTeamMemberDto,
      );
    }
  }

  const personas: PersonaDto[] = isRight(personasResult)
    ? personasResult.right[0].map((p) => PersonaMapper.fromDomainToDto(p) as PersonaDto)
    : [];

  const communityGroups: CommunityGroupDto[] = isRight(communityGroupsResult)
    ? communityGroupsResult.right[0].map(
        (g) => CommunityGroupMapper.fromDomainToDto(g) as CommunityGroupDto,
      )
    : [];

  const projectGalleries: ProjectGalleryDto[] = isRight(projectGalleriesResult)
    ? projectGalleriesResult.right[0].map(
        (p) => ProjectGalleryMapper.fromDomainToDto(p) as ProjectGalleryDto,
      )
    : [];

  const testimonials: TestimonialDto[] = isRight(testimonialsResult)
    ? testimonialsResult.right[0].map((t) => TestimonialMapper.fromDomainToDto(t) as TestimonialDto)
    : [];

  const memberCount = isRight(usersResult) ? usersResult.right[0].length || 138 : 138;
  const achievementCount = isRight(achievementsResult)
    ? achievementsResult.right[0].length || 26
    : 26;

  return (
    <Main>
      <HomeView
        activeCoreTeam={
          activeCoreTeam
            ? (CoreTeamMapper.fromDomainToDto(activeCoreTeam) as CoreTeamDto)
            : undefined
        }
        coreTeamMembers={coreTeamMembers}
        personas={personas}
        communityGroups={communityGroups}
        projectGalleries={projectGalleries}
        testimonials={testimonials}
        memberCount={memberCount}
        achievementCount={achievementCount}
      />
    </Main>
  );
}
