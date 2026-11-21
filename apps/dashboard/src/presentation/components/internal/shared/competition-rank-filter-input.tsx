'use client';

import { clientContainer } from '@app/client-injection';
import { CompetitionRank } from '@infiniteuny/infinity-domain';
import { EntitySelectFilterInput } from './entity-select-filter-input';
import { GetCompetitionRanks } from '@infiniteuny/infinity-application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { SYMBOLS } from '@config';
import { useCallback, useMemo } from 'react';

const getOptionLabel = (option: CompetitionRank) => option.name;

export function CompetitionRankFilterInput(props: GridFilterInputValueProps) {
  const getOptions = useMemo(
    () => clientContainer.get<GetCompetitionRanks>(SYMBOLS.GetCompetitionRanks),
    [],
  );

  const fetchOptions = useCallback(
    (signal: AbortSignal) => getOptions.execute(undefined, undefined, { perPage: 100 }, signal),
    [getOptions],
  );

  return (
    <EntitySelectFilterInput
      {...props}
      labelId="competitionRankFilter-label"
      fetchOptions={fetchOptions}
      getOptionLabel={getOptionLabel}
      errorContext="competition ranks"
    />
  );
}
