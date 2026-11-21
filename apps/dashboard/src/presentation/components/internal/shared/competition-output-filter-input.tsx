'use client';

import { clientContainer } from '@app/client-injection';
import { CompetitionOutput } from '@infiniteuny/infinity-domain';
import { EntitySelectFilterInput } from './entity-select-filter-input';
import { GetCompetitionOutputs } from '@infiniteuny/infinity-application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { SYMBOLS } from '@config';
import { useCallback, useMemo } from 'react';

const getOptionLabel = (option: CompetitionOutput) => option.name;

export function CompetitionOutputFilterInput(props: GridFilterInputValueProps) {
  const getOptions = useMemo(
    () => clientContainer.get<GetCompetitionOutputs>(SYMBOLS.GetCompetitionOutputs),
    [],
  );

  const fetchOptions = useCallback(
    (signal: AbortSignal) => getOptions.execute(undefined, undefined, { perPage: 100 }, signal),
    [getOptions],
  );

  return (
    <EntitySelectFilterInput
      {...props}
      labelId="competitionOutputFilter-label"
      fetchOptions={fetchOptions}
      getOptionLabel={getOptionLabel}
      errorContext="competition outputs"
    />
  );
}
