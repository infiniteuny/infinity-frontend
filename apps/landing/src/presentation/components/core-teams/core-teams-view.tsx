'use client';

import { Box, Container } from '@mui/material';
import { CoreTeamDivisionItem, CoreTeamsFilter } from './core-teams-filter';
import { CoreTeamDto, CoreTeamMemberDto } from '@infiniteuny/infinity-infrastructure';
import { CoreTeamsGrid } from './core-teams-grid';
import { CoreTeamsHeader } from './core-teams-header';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  coreTeams: CoreTeamDto[];
  selectedCoreTeam?: CoreTeamDto;
  members: CoreTeamMemberDto[];
};

export function CoreTeamsView({ coreTeams, selectedCoreTeam, members }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');

  useEffect(() => {
    if (!selectedCoreTeam) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('year') !== String(selectedCoreTeam.year)) {
      params.set('year', String(selectedCoreTeam.year));
      router.replace(`/core-teams?${params.toString()}`, { scroll: false });
    }
  }, [selectedCoreTeam, router]);

  const handleYearChange = (year: number) => {
    setSelectedDivision('ALL');
    router.push(`/core-teams?year=${encodeURIComponent(String(year))}`);
  };

  const divisions = useMemo<CoreTeamDivisionItem[]>(() => {
    const map = new Map<string, CoreTeamDivisionItem>();
    for (const member of members) {
      const div = member.membership?.core_team_division;
      if (div && !map.has(div.id)) {
        map.set(div.id, { id: div.id, name: div.name, priority: div.priority });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.priority - b.priority);
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesDivision =
        selectedDivision === 'ALL' ||
        member.membership?.core_team_division?.id === selectedDivision;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        (member.major?.name ?? '').toLowerCase().includes(query) ||
        (member.membership?.core_team_division?.name ?? '').toLowerCase().includes(query);
      return matchesDivision && matchesSearch;
    });
  }, [members, selectedDivision, searchQuery]);

  return (
    <Box className="flex min-h-[calc(100vh-9.625rem)] flex-col">
      <Box className="pt-12 pb-8 md:pt-16 md:pb-12">
        <Container maxWidth="lg">
          <CoreTeamsHeader />
        </Container>
      </Box>

      <Box className="relative">
        <Box
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 -bottom-px bg-(--m3-palette-surfaceContainerLowest-main)"
        />
        <Container maxWidth="lg" className="relative z-10">
          <CoreTeamsFilter
            coreTeams={coreTeams}
            selectedCoreTeam={selectedCoreTeam}
            onYearChange={handleYearChange}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            divisions={divisions}
            selectedDivision={selectedDivision}
            onSelectDivision={setSelectedDivision}
            totalMembersCount={members.length}
          />
        </Container>
      </Box>

      <Box className="flex-1 bg-(--m3-palette-surfaceContainerLowest-main) pt-10 pb-16 md:pt-12 md:pb-20">
        <Container maxWidth="lg">
          <CoreTeamsGrid members={filteredMembers} />
        </Container>
      </Box>
    </Box>
  );
}
