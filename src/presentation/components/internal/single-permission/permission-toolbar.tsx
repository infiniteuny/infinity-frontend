'use client';

import Link from 'next/link';
import { Box, Button } from '@mui/material';
import { PermissionInput } from './permission-form';
import { EditRounded, SaveRounded } from '@mui/icons-material';
import { RefObject } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useRouter } from 'next/navigation';

type ViewProps = {
  permissionId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<PermissionInput>;
};

export function PermissionToolbar({ permissionId, ref, methods }: OneOf<[ViewProps, FormProps]>) {
  const router = useRouter();

  if (permissionId) {
    return (
      <Box className="ml-auto">
        <Button
          variant="filled"
          className="ml-4"
          aria-label="Edit permission"
          LinkComponent={Link}
          href={`/permissions/${permissionId}/edit`}
          startIcon={<EditRounded />}
        >
          Edit permission
        </Button>
      </Box>
    );
  } else if (ref && methods) {
    const {
      formState: { isDirty, isSubmitting },
    } = methods;
    return (
      <Box className="ml-auto">
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
          aria-label="Save permission"
          startIcon={<SaveRounded />}
          disabled={!isDirty || isSubmitting}
          onClick={() => ref.current?.requestSubmit()}
        >
          Save permission
        </Button>
      </Box>
    );
  } else {
    return null;
  }
}
