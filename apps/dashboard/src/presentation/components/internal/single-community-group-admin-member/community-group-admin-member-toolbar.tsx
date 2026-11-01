'use client';

import Link from 'next/link';
import { Box, Button } from '@mui/material';
import { CommunityGroupAdminMemberInput } from './community-group-admin-member-form';
import { EditRounded, SaveRounded } from '@mui/icons-material';
import { RefObject } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useInternalStore } from '@app/presentation/hooks';

type ViewProps = {
  communityGroupAdminId: string;
  communityGroupAdminMemberId: string;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<CommunityGroupAdminMemberInput>;
};

export function CommunityGroupAdminMemberToolbar({
  communityGroupAdminId,
  communityGroupAdminMemberId,
  ref,
  methods,
}: OneOf<[ViewProps, FormProps]>) {
  const router = useRouter();
  const userPermissions = useInternalStore((s) => s.session?.permissions || []);

  if (communityGroupAdminId && communityGroupAdminMemberId) {
    return (
      <Box className="ml-auto">
        {['update-community-group-admin-member'].some((p) => userPermissions.includes(p)) ? (
          <Button
            variant="filled"
            className="ml-4"
            aria-label="Edit community group admin member"
            LinkComponent={Link}
            href={`/community-group-admins/${communityGroupAdminId}/members/${communityGroupAdminMemberId}/edit`}
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
          aria-label="Save community group admin member"
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
