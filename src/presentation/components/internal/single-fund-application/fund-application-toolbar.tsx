'use client';

import Link from 'next/link';
import { Box, Button } from '@mui/material';
import { EditRounded, SaveRounded } from '@mui/icons-material';
import { FundApplicationDto, FundApplicationMapper } from '@app/infrastructure/dtos';
import { FundApplicationInput } from './fund-application-form';
import { RefObject, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useInternalStore } from '@app/presentation/hooks';

type ViewProps = {
  fundApplication: FundApplicationDto;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<FundApplicationInput>;
};

export function FundApplicationToolbar({
  fundApplication,
  ref,
  methods,
}: OneOf<[ViewProps, FormProps]>) {
  const router = useRouter();
  const session = useInternalStore((s) => s.session);
  const userPermissions = session?.permissions || [];
  const parsedFundApplication = useMemo(
    () => (fundApplication ? FundApplicationMapper.fromDtoToDomain(fundApplication) : undefined),
    [fundApplication],
  );

  if (fundApplication && parsedFundApplication) {
    return (
      <Box className="ml-auto">
        {userPermissions.includes('update-fund-application') ||
        (userPermissions.includes('update-own-fund-application') &&
          parsedFundApplication.team?.members?.some((member) => member.id === session?.user.id)) ? (
          <Button
            variant="filled"
            className="ml-4"
            aria-label="Edit fund application"
            LinkComponent={Link}
            href={`/fund-applications/${parsedFundApplication.id}/edit`}
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
          aria-label="Save fund application"
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
