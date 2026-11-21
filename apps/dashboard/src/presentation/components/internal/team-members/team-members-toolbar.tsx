'use client';

import Link from 'next/link';
import { AddRounded, SearchRounded } from '@mui/icons-material';
import { Box, Button, IconButton } from '@mui/material';
import { useInternalStore } from '@app/presentation/hooks';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { RefObject } from 'react';

type Props = {
  dataGridApiRef: RefObject<GridApiCommunity | null>;
  teamId: string;
  leaderId: string;
};

export function TeamMembersToolbar({ teamId, leaderId, dataGridApiRef }: Props) {
  const session = useInternalStore((s) => s.session);
  const userPermissions = new Set(session?.permissions ?? []);

  return (
    <>
      <Box className="ml-auto">
        <IconButton
          className="ml-4"
          aria-label="Search"
          onClick={() => {
            dataGridApiRef.current?.showFilterPanel();
          }}
        >
          <SearchRounded />
        </IconButton>
        {['create-team-member'].some((p) => userPermissions.has(p)) ||
        (['create-own-team-member'].some((p) => userPermissions.has(p)) &&
          leaderId === session?.user.id) ? (
          <Button
            variant="filled"
            className="ml-4"
            aria-label="Add team member"
            LinkComponent={Link}
            href={`/teams/${teamId}/members/new`}
            startIcon={<AddRounded />}
          >
            Add
          </Button>
        ) : null}
      </Box>
    </>
  );
}
