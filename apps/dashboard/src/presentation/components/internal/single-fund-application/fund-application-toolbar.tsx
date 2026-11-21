'use client';

import { clientContainer } from '@app/client-injection';
import { DeleteFundApplication } from '@infiniteuny/infinity-application';
import { SYMBOLS } from '@config';
import {
  FundApplicationDto,
  FundApplicationMapper,
} from '@infiniteuny/infinity-infrastructure/dtos';
import { FundApplicationInput } from './fund-application-form';
import { RefObject, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useInternalStore, useUserPermissions } from '@app/presentation/hooks';
import { SingleEntityToolbar } from '@app/presentation/components/internal/shared';

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
  const deleteFundApplication = useMemo(
    () => clientContainer.get<DeleteFundApplication>(SYMBOLS.DeleteFundApplication),
    [],
  );
  const session = useInternalStore((s) => s.session);
  const userPermissions = useUserPermissions();
  const parsedFundApplication = useMemo(
    () => (fundApplication ? FundApplicationMapper.fromDtoToDomain(fundApplication) : undefined),
    [fundApplication],
  );

  if (fundApplication && parsedFundApplication) {
    return (
      <SingleEntityToolbar
        mode="view"
        canEdit={Boolean(
          userPermissions.has('update-fund-application') ||
          (userPermissions.has('update-own-fund-application') &&
            parsedFundApplication.team?.members?.some((member) => member.id === session?.user.id)),
        )}
        editHref={`/fund-applications/${parsedFundApplication.id}/edit`}
        entityName="fund application"
        entityDisplayName={parsedFundApplication.team?.name}
        canDelete={Boolean(
          userPermissions.has('delete-fund-application') ||
          (userPermissions.has('delete-own-fund-application') &&
            parsedFundApplication.team?.members?.some((member) => member.id === session?.user.id)),
        )}
        onDelete={() => deleteFundApplication.execute(parsedFundApplication.id)}
        deleteRedirectHref={'/fund-applications'}
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
        saveAriaLabel="Save fund application"
      />
    );
  } else {
    return null;
  }
}
