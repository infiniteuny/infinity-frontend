import { CreateConfig, UpdateConfig } from '@app/application';
import { clientContainer } from '@app/client-injection';
import { Config } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { Box, Container, Typography } from '@mui/material';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
import { match } from 'effect/Either';
import { useMemo, useState } from 'react';

type Props = {
  initialValue?: Config;
  startDate?: DateTime | null;
  onChange?: (date: DateTime | null) => void;
};

export function EndReregistrationPeriodTile({ initialValue, startDate, onChange }: Props) {
  const key = 'end_reregistration_date';
  const createConfig = useMemo(() => clientContainer.get<CreateConfig>(SYMBOLS.CreateConfig), []);
  const updateConfig = useMemo(() => clientContainer.get<UpdateConfig>(SYMBOLS.UpdateConfig), []);

  const [created, setCreated] = useState(initialValue !== undefined);
  const [dateValue, setDateValue] = useState<DateTime | null>(
    initialValue?.value ? DateTime.fromISO(initialValue.value, { zone: 'UTC' }) : null,
  );
  const [error, setError] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);

  const handleAccept = async (date: DateTime | null) => {
    if (date && startDate && date < startDate) {
      const message = 'End date must be after start date';
      setError(message);
      return;
    }

    setError(null);
    setDisabled(true);

    if (!date) {
      setDateValue(null);
      onChange?.(null);
      if (created) {
        const result = await updateConfig.execute(key, { value: '' });
        match(result, {
          onLeft: (err) => {
            console.error('Failed to update config:', err);
            setDateValue(
              initialValue?.value ? DateTime.fromISO(initialValue.value, { zone: 'UTC' }) : null,
            );
            onChange?.(
              initialValue?.value ? DateTime.fromISO(initialValue.value, { zone: 'UTC' }) : null,
            );
          },
          onRight: () => {},
        });
      }
      setDisabled(false);
      return;
    }

    const isoValue = date.toISODate();

    let result;
    if (!created) {
      result = await createConfig.execute({
        key: key,
        value: isoValue ?? '',
        type: 'STRING',
        isPrivate: true,
      });
    } else {
      result = await updateConfig.execute(key, {
        value: isoValue ?? '',
      });
    }

    match(result, {
      onLeft: (err) => {
        console.error('Failed to update config:', err);
        setDateValue(
          initialValue?.value ? DateTime.fromISO(initialValue.value, { zone: 'UTC' }) : null,
        );
      },
      onRight: () => {
        setCreated(true);
        setDateValue(date);
        onChange?.(date);
      },
    });

    setDisabled(false);
  };

  return (
    <Container
      maxWidth={false}
      sx={{ bgcolor: 'surfaceContainerHigh.main' }}
      className={`flex w-full justify-start rounded-t-md rounded-b-2xl p-4 text-left select-text`}
    >
      <Box className="flex-1">
        <Typography variant="body1" component="p" className="font-medium">
          End of re-registration period
        </Typography>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <DatePicker
            timezone="UTC"
            disabled={disabled}
            format="dd/LL/yyyy"
            value={dateValue}
            onAccept={handleAccept}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: 'standard',
                hiddenLabel: true,
                error: !!error,
                helperText: error,
                slotProps: {
                  input: {
                    disableUnderline: true,
                  },
                  inputLabel: {
                    hidden: true,
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
      </Box>
    </Container>
  );
}
