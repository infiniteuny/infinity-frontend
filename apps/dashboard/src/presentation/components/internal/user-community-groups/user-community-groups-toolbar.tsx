'use client';

import Link from 'next/link';
import { AddRounded, SearchRounded } from '@mui/icons-material';
import { Box, Button, IconButton } from '@mui/material';
import { useInternalStore } from '@app/presentation/hooks';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { RefObject } from 'react';

type Props = {
  dataGridApiRef: RefObject<GridApiCommunity | null>;
  userId: string;
  isProfileView?: boolean;
};

export function UserCommunityGroupsToolbar({ userId, isProfileView, dataGridApiRef }: Props) {
  const userPermissions = new Set(useInternalStore((s) => s.session?.permissions ?? []));

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
        {['create-community-group-member', 'create-own-community-group-member'].some((p) =>
          userPermissions.has(p),
        ) ? (
          <Button
            variant="filled"
            className="ml-4"
            aria-label="Add user community group"
            LinkComponent={Link}
            href={
              isProfileView
                ? '/settings/profile/community-groups/new'
                : `/users/${userId}/community-groups/new`
            }
            startIcon={<AddRounded />}
          >
            Add
          </Button>
        ) : null}
      </Box>
    </>
  );
}
