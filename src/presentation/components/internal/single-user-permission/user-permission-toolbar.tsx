'use client';

import { Box, Button } from '@mui/material';
import { UserPermissionInput } from './user-permission-form';
import { SaveRounded } from '@mui/icons-material';
import { RefObject } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useRouter } from 'next/navigation';

type Props = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<UserPermissionInput>;
};

export function UserPermissionToolbar({ ref, methods }: Props) {
  const router = useRouter();
  const {
    formState: { isDirty, isSubmitting },
  } = methods;

  return (
    <Box className="ml-auto flex flex-wrap-reverse justify-end gap-y-2">
      <Button
        variant="text"
        className="ml-4"
        aria-label="Cancel"
        disabled={isSubmitting}
        onClick={() => router.back()}
      >
        Cancel
      </Button>
      <Button
        variant="filled"
        className="ml-4"
        aria-label="Save user permission"
        startIcon={<SaveRounded />}
        disabled={!isDirty || isSubmitting}
        onClick={() => ref.current?.requestSubmit()}
      >
        Save
      </Button>
    </Box>
  );
}
