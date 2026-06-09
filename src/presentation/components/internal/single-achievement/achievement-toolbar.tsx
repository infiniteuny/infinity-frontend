'use client';

import Link from 'next/link';
import { AchievementDto, AchievementMapper } from '@app/infrastructure/dtos';
import { AchievementInput } from './achievement-form';
import { Box, Button } from '@mui/material';
import { EditRounded, SaveRounded } from '@mui/icons-material';
import { RefObject, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useInternalStore } from '@app/presentation/hooks';

type ViewProps = {
  achievement: AchievementDto;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<AchievementInput>;
};

export function AchievementToolbar({ achievement, ref, methods }: OneOf<[ViewProps, FormProps]>) {
  const router = useRouter();
  const session = useInternalStore((s) => s.session);
  const userPermissions = session?.permissions || [];
  const parsedAchievement = useMemo(
    () => (achievement ? AchievementMapper.fromDtoToDomain(achievement) : undefined),
    [achievement],
  );

  if (achievement && parsedAchievement) {
    return (
      <Box className="ml-auto">
        {userPermissions.includes('update-achievement') ||
        (userPermissions.includes('update-own-achievement') &&
          parsedAchievement.team?.members?.some((member) => member.id === session?.user.id)) ? (
          <Button
            variant="filled"
            className="ml-4"
            aria-label="Edit achievement"
            LinkComponent={Link}
            href={`/achievements/${parsedAchievement.id}/edit`}
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
          aria-label="Save achievement"
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
