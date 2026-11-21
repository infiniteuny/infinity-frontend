'use client';

import { clientContainer } from '@app/client-injection';
import { DeleteGroup } from '@infiniteuny/infinity-application';
import { SYMBOLS } from '@config';
import { GroupDto, GroupMapper } from '@infiniteuny/infinity-infrastructure';
import { GroupInput } from './group-form';
import { RefObject, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

type ViewProps = {
  group: GroupDto;
};

type FormProps = {
  ref: RefObject<HTMLFormElement | null>;
  methods: UseFormReturn<GroupInput>;
};

export function GroupToolbar({ group, ref, methods }: OneOf<[ViewProps, FormProps]>) {
  const deleteGroup = useMemo(() => clientContainer.get<DeleteGroup>(SYMBOLS.DeleteGroup), []);
  const userPermissions = useUserPermissions();
  const parsedGroup = useMemo(
    () => (group ? GroupMapper.fromDtoToDomain(group) : undefined),
    [group],
  );

  if (group && parsedGroup) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={['update-group'].some((p) => userPermissions.has(p)) && !parsedGroup.isManaged}
        editHref={`/groups/${group.id}/edit`}
        editAriaLabel="Edit group"
        canDelete={userPermissions.has('delete-group') && !parsedGroup.isManaged}
        deleteAriaLabel={'Delete group'}
        deleteConfirmDescription={`Are you sure you want to permanently delete ${parsedGroup.name || 'this group'}? This action cannot be undone.`}
        onDelete={() => deleteGroup.execute(parsedGroup.id)}
        deleteRedirectHref={'/groups'}
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
        saveAriaLabel="Save group"
      />
    );
  } else {
    return null;
  }
}
