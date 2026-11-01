'use client';

import Link from 'next/link';
import { Box, Button } from '@mui/material';
import { MajorInput } from './major-form';
import { EditRounded, SaveRounded } from '@mui/icons-material';
import { RefObject } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useInternalStore } from '@app/presentation/hooks';

type ViewProps = {
  majorId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<MajorInput>;
};

export function MajorToolbar({ majorId, ref, methods }: OneOf<[ViewProps, FormProps]>) {
  const router = useRouter();
  const userPermissions = useInternalStore((s) => s.session?.permissions || []);

  if (majorId) {
    return (
      <Box className="ml-auto">
        {['update-major'].some((p) => userPermissions.includes(p)) ? (
          <Button
            variant="filled"
            className="ml-4"
            aria-label="Edit major"
            LinkComponent={Link}
            href={`/majors/${majorId}/edit`}
            startIcon={<EditRounded />}
          >
            Edit
          </Button>
        ) : null}
      </Box>
    );
  } else if (ref && methods) {
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
          aria-label="Save major"
          startIcon={<SaveRounded />}
          disabled={!isDirty || isSubmitting}
          onClick={() => ref.current?.requestSubmit()}
        >
          Save
        </Button>
      </Box>
    );
  } else {
    return null;
  }
}
