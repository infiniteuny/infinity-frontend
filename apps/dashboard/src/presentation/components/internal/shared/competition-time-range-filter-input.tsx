'use client';

import { clientContainer } from '@app/client-injection';
import { CompetitionTimeRange } from '@infiniteuny/infinity-domain';
import { EntitySelectFilterInput } from './entity-select-filter-input';
import { GetCompetitionTimeRanges } from '@infiniteuny/infinity-application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { SYMBOLS } from '@config';
import { useCallback, useMemo } from 'react';

const getOptionLabel = (option: CompetitionTimeRange) => option.name;

export function CompetitionTimeRangeFilterInput(props: GridFilterInputValueProps) {
  const getOptions = useMemo(
    () => clientContainer.get<GetCompetitionTimeRanges>(SYMBOLS.GetCompetitionTimeRanges),
    [],
  );

  const fetchOptions = useCallback(
    (signal: AbortSignal) => getOptions.execute(undefined, undefined, { perPage: 100 }, signal),
    [getOptions],
  );

  return (
    <EntitySelectFilterInput
      {...props}
      labelId="competitionTimeRangeFilter-label"
      fetchOptions={fetchOptions}
      getOptionLabel={getOptionLabel}
      errorContext="competition time ranges"
    />
  );
}
