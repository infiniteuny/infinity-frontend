import { clientContainer } from '@app/client-injection';
import { Autocomplete, TextField } from '@mui/material';
import { GetCompetitionInstances } from '@app/application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { CompetitionInstance } from '@app/domain/entities';
import { useEffect, useMemo, useState } from 'react';

export function CompetitionInstanceFilterInput({ item, applyValue }: GridFilterInputValueProps) {
  const getCompetitionInstances = useMemo(
    () => clientContainer.get<GetCompetitionInstances>(SYMBOLS.GetCompetitionInstances),
    [],
  );

  const [CompetitionInstanceInput, setCompetitionInstanceInput] = useState('');
  const [CompetitionInstanceOptions, setCompetitionInstanceOptions] = useState<
    CompetitionInstance[]
  >([]);
  const [isCompetitionInstanceLoading, setIsCompetitionInstanceLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const query = CompetitionInstanceInput.trim();

    if (query.length < 1) {
      return () => {
        active = false;
      };
    }

    const timeoutId = setTimeout(async () => {
      setIsCompetitionInstanceLoading(true);

      const CompetitionInstancesResult = await getCompetitionInstances.execute(
        undefined,
        { name: query },
        undefined,
        {
          perPage: 10,
        },
      );

      if (!active) return;

      match(CompetitionInstancesResult, {
        onLeft: () => {
          setCompetitionInstanceOptions([]);
        },
        onRight: ([CompetitionInstances]) => {
          setCompetitionInstanceOptions(CompetitionInstances);
        },
      });

      setIsCompetitionInstanceLoading(false);
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [getCompetitionInstances, CompetitionInstanceInput]);

  return (
    <Autocomplete
      options={CompetitionInstanceOptions}
      value={
        CompetitionInstanceOptions.find(
          (CompetitionInstance) => CompetitionInstance.id === item.value,
        ) ?? null
      }
      onChange={(_, CompetitionInstance) => {
        applyValue({ ...item, value: CompetitionInstance?.id ?? '' });
      }}
      inputValue={CompetitionInstanceInput}
      onInputChange={(_, value) => {
        setCompetitionInstanceInput(value);

        if (value.trim().length < 1) {
          setCompetitionInstanceOptions([]);
          setIsCompetitionInstanceLoading(false);
        }
      }}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={isCompetitionInstanceLoading}
      noOptionsText={
        CompetitionInstanceInput
          ? 'No competition instances found'
          : 'Type to search competition instance'
      }
      filterOptions={(options) => options}
      renderInput={(params) => (
        <TextField {...params} label="Value" fullWidth margin="none" size="small" />
      )}
    />
  );
}
