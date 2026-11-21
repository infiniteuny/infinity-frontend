'use client';

import { TeamDto, TeamMapper } from '@infiniteuny/infinity-infrastructure';
import { TeamInput } from './team-form';
import { RefObject, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useInternalStore, useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  team: TeamDto;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<TeamInput>;
};

export function TeamToolbar({ team, ref, methods }: OneOf<[ViewProps, FormProps]>) {
  const session = useInternalStore((s) => s.session);
  const userPermissions = useUserPermissions();
  const parsedTeam = useMemo(() => (team ? TeamMapper.fromDtoToDomain(team) : undefined), [team]);

  if (team && parsedTeam) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={
          userPermissions.has('update-team') ||
          (userPermissions.has('update-own-team') && parsedTeam.leaderId === session?.user.id)
        }
        editHref={`/teams/${parsedTeam.id}/edit`}
        editAriaLabel="Edit team"
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
        saveAriaLabel="Save team"
      />
    );
  } else {
    return null;
  }
}
