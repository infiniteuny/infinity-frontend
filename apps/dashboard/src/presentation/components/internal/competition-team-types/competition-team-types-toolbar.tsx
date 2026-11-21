'use client';

import Link from 'next/link';
import { AddRounded, SearchRounded } from '@mui/icons-material';
import { Box, Button, IconButton } from '@mui/material';
import { useUserPermissions } from '@app/presentation/hooks';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { RefObject } from 'react';

type Props = {
  dataGridApiRef: RefObject<GridApiCommunity | null>;
};

export function CompetitionTeamTypesToolbar({ dataGridApiRef }: Props) {
  const userPermissions = useUserPermissions();

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
        {['create-competition-team-type'].some((p) => userPermissions.has(p)) ? (
          <Button
            variant="filled"
            className="ml-4"
            aria-label="Add team type"
            LinkComponent={Link}
            href="/team-types/new"
            startIcon={<AddRounded />}
          >
            Add
          </Button>
        ) : null}
      </Box>
    </>
  );
}
