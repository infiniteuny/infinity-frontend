'use client';

import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { useInternalStore } from '@app/presentation/hooks';

type Props = {
  userId: string;
  isProfileView?: boolean;
};

export function UserPersonasToolbar({ userId, isProfileView }: Props) {
  const userPermissions = new Set(useInternalStore((s) => s.session?.permissions ?? []));

  return (
    <>
      {['create-user-persona', 'create-own-user-persona'].some((p) => userPermissions.has(p)) ? (
        <Box className="ml-auto">
          <Button
            variant="filled"
            className="ml-4"
            aria-label="Add user persona"
            LinkComponent={Link}
            href={
              isProfileView ? '/settings/profile/personas/new' : `/users/${userId}/personas/new`
            }
            startIcon={<AddRounded />}
          >
            Add
          </Button>
        </Box>
      ) : null}
    </>
  );
}
