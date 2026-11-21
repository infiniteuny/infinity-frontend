'use client';

import { clientContainer } from '@app/client-injection';
import { DeleteAchievement } from '@infiniteuny/infinity-application';
import { SYMBOLS } from '@config';
import { AchievementDto, AchievementMapper } from '@infiniteuny/infinity-infrastructure/dtos';
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
  const deleteAchievement = useMemo(
    () => clientContainer.get<DeleteAchievement>(SYMBOLS.DeleteAchievement),
    [],
  );
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
        entityName="achievement"
        entityDisplayName={parsedAchievement.team?.name}
        canDelete={Boolean(
          userPermissions.has('delete-achievement') ||
          (userPermissions.has('delete-own-achievement') &&
            parsedAchievement.team?.members?.some((member) => member.id === session?.user.id)),
        )}
        onDelete={() => deleteAchievement.execute(parsedAchievement.id)}
        deleteRedirectHref={'/achievements'}
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
