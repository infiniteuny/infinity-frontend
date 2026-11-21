'use client';

import { clientContainer } from '@app/client-injection';
import { CoreTeamDivision } from '@infiniteuny/infinity-domain';
import { EntitySelectFilterInput } from './entity-select-filter-input';
import { GetCoreTeamDivisions } from '@infiniteuny/infinity-application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { SYMBOLS } from '@config';
import { useCallback, useMemo } from 'react';

const getOptionLabel = (option: CoreTeamDivision) => option.name;

export function CoreTeamDivisionFilterInput(props: GridFilterInputValueProps) {
  const getOptions = useMemo(
    () => clientContainer.get<GetCoreTeamDivisions>(SYMBOLS.GetCoreTeamDivisions),
    [],
  );

  const fetchOptions = useCallback(
    (signal: AbortSignal) => getOptions.execute(undefined, undefined, { perPage: 100 }, signal),
    [getOptions],
  );

  return (
    <EntitySelectFilterInput
      {...props}
      labelId="coreTeamDivisionFilter-label"
      fetchOptions={fetchOptions}
      getOptionLabel={getOptionLabel}
      errorContext="core team divisions"
    />
  );
}
