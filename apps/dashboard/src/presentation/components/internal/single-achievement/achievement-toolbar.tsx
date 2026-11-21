'use client';

import { AchievementDto, AchievementMapper } from '@infiniteuny/infinity-infrastructure';
import { AchievementInput } from './achievement-form';
import { RefObject, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useInternalStore, useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  achievement: AchievementDto;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<AchievementInput>;
};

export function AchievementToolbar({ achievement, ref, methods }: OneOf<[ViewProps, FormProps]>) {
  const session = useInternalStore((s) => s.session);
  const userPermissions = useUserPermissions();
  const parsedAchievement = useMemo(
    () => (achievement ? AchievementMapper.fromDtoToDomain(achievement) : undefined),
    [achievement],
  );

  if (achievement && parsedAchievement) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={Boolean(
          userPermissions.has('update-achievement') ||
          (userPermissions.has('update-own-achievement') &&
            parsedAchievement.team?.members?.some((member) => member.id === session?.user.id)),
        )}
        editHref={`/achievements/${parsedAchievement.id}/edit`}
        editAriaLabel="Edit achievement"
      />
    );
  } else if (ref && methods) {
    const {
      formState: { isDirty, isSubmitting },
    } = methods;

    return (
      <SingleEntityToolbar
        mode="form"
        formRef={ref}
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        saveAriaLabel="Save achievement"
      />
    );
  } else {
    return null;
  }
}
