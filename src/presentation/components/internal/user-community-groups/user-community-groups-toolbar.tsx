'use client';

import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { useInternalStore } from '@app/presentation/hooks';

type Props = {
  userId: string;
};

export function UserCommunityGroupsToolbar({ userId }: Props) {
  const userPermissions = new Set(useInternalStore((s) => s.session?.permissions ?? []));

  return (
    <>
      {['create-community-group-member', 'create-own-community-group-member'].some((p) =>
        userPermissions.has(p),
      ) ? (
        <Box className="ml-auto">
          <Button
            variant="filled"
            className="ml-4"
            aria-label="Add user community group"
            LinkComponent={Link}
            href={`/users/${userId}/community-groups/new`}
            startIcon={<AddRounded />}
          >
            Add
          </Button>
        </Box>
      ) : null}
    </>
  );
}
