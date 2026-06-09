'use client';

import Link from 'next/link';
import { Box, Button } from '@mui/material';
import { TeamDto, TeamMapper } from '@app/infrastructure/dtos';
import { TeamInput } from './team-form';
import { EditRounded, SaveRounded } from '@mui/icons-material';
import { RefObject, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useInternalStore } from '@app/presentation/hooks';

type ViewProps = {
  team: TeamDto;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<TeamInput>;
};

export function TeamToolbar({ team, ref, methods }: OneOf<[ViewProps, FormProps]>) {
  const router = useRouter();
  const session = useInternalStore((s) => s.session);
  const userPermissions = session?.permissions || [];
  const parsedTeam = useMemo(() => (team ? TeamMapper.fromDtoToDomain(team) : undefined), [team]);

  if (team && parsedTeam) {
    return (
      <Box className="ml-auto">
        {userPermissions.includes('update-team') ||
        (userPermissions.includes('update-own-team') &&
          parsedTeam.members?.some((member) => member.id === session?.user.id)) ? (
          <Button
            variant="filled"
            className="ml-4"
            aria-label="Edit team"
            LinkComponent={Link}
            href={`/teams/${parsedTeam.id}/edit`}
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
          aria-label="Save team"
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
