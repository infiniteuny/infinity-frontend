'use client';

import { AboutSection } from './about-section';
import { Box } from '@mui/material';
import {
  CommunityGroupDto,
  CommunityGroupMapper,
  CoreTeamDto,
  CoreTeamMapper,
  CoreTeamMemberDto,
  PersonaDto,
  PersonaMapper,
  ProjectGalleryDto,
  ProjectGalleryMapper,
  TestimonialDto,
  TestimonialMapper,
} from '@infiniteuny/infinity-infrastructure';
import { ContactSection } from './contact-section';
import { FaqSection } from './faq-section';
import { FunfactsSection } from './funfacts-section';
import { HeroSection } from './hero-section';
import { ProjectsSection } from './projects-section';
import { CommunitySection } from './community-section';
import { OrganizationSection } from './organization-section';
import { TestimonialsSection } from './testimonials-section';

type Props = {
  activeCoreTeam?: CoreTeamDto;
  coreTeamMembers: CoreTeamMemberDto[];
  personas: PersonaDto[];
  communityGroups: CommunityGroupDto[];
  projectGalleries: ProjectGalleryDto[];
  testimonials: TestimonialDto[];
  memberCount: number;
  achievementCount: number;
};

export function HomeView({
  activeCoreTeam,
  coreTeamMembers,
  personas,
  communityGroups,
  projectGalleries,
  testimonials,
  memberCount,
  achievementCount,
}: Props) {
  const coreTeam = activeCoreTeam ? CoreTeamMapper.fromDtoToDomain(activeCoreTeam) : undefined;
  const domainPersonas = personas.map((p) => PersonaMapper.fromDtoToDomain(p));
  const domainGroups = communityGroups.map((g) => CommunityGroupMapper.fromDtoToDomain(g));
  const domainProjects = projectGalleries.map((p) => ProjectGalleryMapper.fromDtoToDomain(p));
  const domainTestimonials = testimonials.map((t) => TestimonialMapper.fromDtoToDomain(t));

  return (
    <Box>
      <HeroSection />
      <AboutSection />
      <CommunitySection personas={domainPersonas} communityGroups={domainGroups} />
      <OrganizationSection coreTeam={coreTeam} members={coreTeamMembers} />
      <ProjectsSection projects={domainProjects} />
      <TestimonialsSection testimonials={domainTestimonials} />
      <FunfactsSection
        communityGroupsCount={domainGroups.length}
        memberCount={memberCount}
        achievementCount={achievementCount}
        projectsCount={domainProjects.length}
      />
      <FaqSection />
      <ContactSection />
    </Box>
  );
}
