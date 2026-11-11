'use client';

import { Box, Container } from '@mui/material';
import {
  CommunityGroupAdminDto,
  CommunityGroupAdminMemberDto,
} from '@infiniteuny/infinity-infrastructure';
import {
  CommunityGroupAdminsFilter,
  CommunityGroupFilterItem,
} from './community-group-admins-filter';
import { CommunityGroupAdminsGrid } from './community-group-admins-grid';
import { CommunityGroupAdminsHeader } from './community-group-admins-header';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  admins: CommunityGroupAdminDto[];
  selectedAdmin?: CommunityGroupAdminDto;
  members: CommunityGroupAdminMemberDto[];
};

export function CommunityGroupAdminsView({ admins, selectedAdmin, members }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');

  useEffect(() => {
    if (!selectedAdmin) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('year') !== String(selectedAdmin.year)) {
      params.set('year', String(selectedAdmin.year));
      router.replace(`/community-group-admins?${params.toString()}`, { scroll: false });
    }
  }, [selectedAdmin, router]);

  const handleYearChange = (year: number) => {
    setSelectedGroup('ALL');
    router.push(`/community-group-admins?year=${encodeURIComponent(String(year))}`);
  };

  const communityGroups = useMemo<CommunityGroupFilterItem[]>(() => {
    const map = new Map<string, CommunityGroupFilterItem>();
    for (const member of members) {
      const group = member.membership?.community_group;
      if (group && !map.has(group.id)) {
        map.set(group.id, { id: group.id, name: group.name });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesGroup =
        selectedGroup === 'ALL' || member.membership?.community_group?.id === selectedGroup;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        (member.major?.name ?? '').toLowerCase().includes(query) ||
        (member.membership?.community_group?.name ?? '').toLowerCase().includes(query);
      return matchesGroup && matchesSearch;
    });
  }, [members, selectedGroup, searchQuery]);

  return (
    <Box className="flex min-h-[calc(100vh-9.625rem)] flex-col">
      <Box className="pt-12 pb-8 md:pt-16 md:pb-12">
        <Container maxWidth="lg">
          <CommunityGroupAdminsHeader />
        </Container>
      </Box>

      <Box className="relative">
        <Box
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 -bottom-px bg-(--m3-palette-surfaceContainerLowest-main)"
        />
        <Container maxWidth="lg" className="relative z-10">
          <CommunityGroupAdminsFilter
            admins={admins}
            selectedAdmin={selectedAdmin}
            onYearChange={handleYearChange}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            communityGroups={communityGroups}
            selectedGroup={selectedGroup}
            onSelectGroup={setSelectedGroup}
            totalMembersCount={members.length}
          />
        </Container>
      </Box>

      <Box className="flex-1 bg-(--m3-palette-surfaceContainerLowest-main) pt-10 pb-16 md:pt-12 md:pb-20">
        <Container maxWidth="lg">
          <CommunityGroupAdminsGrid members={filteredMembers} />
        </Container>
      </Box>
    </Box>
  );
}
