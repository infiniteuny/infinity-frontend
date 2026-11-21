'use client';

import { clientContainer } from '@app/client-injection';
import { CommunityGroup } from '@infiniteuny/infinity-domain';
import { EntitySelectFilterInput } from './entity-select-filter-input';
import { GetCommunityGroups } from '@infiniteuny/infinity-application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { SYMBOLS } from '@config';
import { useCallback, useMemo } from 'react';

const getOptionLabel = (option: CommunityGroup) => option.name;

export function CommunityGroupFilterInput(props: GridFilterInputValueProps) {
  const getOptions = useMemo(
    () => clientContainer.get<GetCommunityGroups>(SYMBOLS.GetCommunityGroups),
    [],
  );

  const fetchOptions = useCallback(
    (signal: AbortSignal) => getOptions.execute(undefined, undefined, { perPage: 100 }, signal),
    [getOptions],
  );

  return (
    <EntitySelectFilterInput
      {...props}
      labelId="communityGroupFilter-label"
      fetchOptions={fetchOptions}
      getOptionLabel={getOptionLabel}
      errorContext="community groups"
    />
  );
}
