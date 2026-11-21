'use client';

import { clientContainer } from '@app/client-injection';
import { DeleteTeam } from '@infiniteuny/infinity-application';
import { SYMBOLS } from '@config';
import { TeamDto, TeamMapper } from '@infiniteuny/infinity-infrastructure/dtos';
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
  const deleteTeam = useMemo(() => clientContainer.get<DeleteTeam>(SYMBOLS.DeleteTeam), []);
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
        entityName="team"
        entityDisplayName={parsedTeam.name}
        canDelete={
          userPermissions.has('delete-team') ||
          (userPermissions.has('delete-own-team') && parsedTeam.leaderId === session?.user.id)
        }
        onDelete={() => deleteTeam.execute(parsedTeam.id)}
        deleteRedirectHref={'/teams'}
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
