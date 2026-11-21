import { CreateConfig, UpdateConfig } from '@infiniteuny/infinity-application';
import { clientContainer } from '@app/client-injection';
import { Config } from '@infiniteuny/infinity-domain';
import { SYMBOLS } from '@config';
import { Box, Container, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
import { match } from 'effect/Either';
import { toast } from 'react-toastify';
import { useMemo, useState } from 'react';

type Props = {
  initialValue?: Config;
  endDate?: DateTime | null;
  onChange?: (date: DateTime | null) => void;
};

export function StartReregistrationPeriodTile({ initialValue, endDate, onChange }: Props) {
  const key = 'start_reregistration_date';
  const createConfig = useMemo(() => clientContainer.get<CreateConfig>(SYMBOLS.CreateConfig), []);
  const updateConfig = useMemo(() => clientContainer.get<UpdateConfig>(SYMBOLS.UpdateConfig), []);

  const [created, setCreated] = useState(initialValue !== undefined);
  const [dateValue, setDateValue] = useState<DateTime | null>(
    initialValue?.value ? DateTime.fromISO(initialValue.value, { zone: 'UTC' }) : null,
  );
  const [error, setError] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);

  const handleAccept = async (date: DateTime | null) => {
    if (date && endDate && date > endDate) {
      const message = 'Start date must be before end date';
      setError(message);
      return;
    }

    setError(null);
    setDisabled(true);

    try {
      if (!date) {
        setDateValue(null);
        onChange?.(null);
        if (created) {
          const result = await updateConfig.execute(key, { value: '' });
          match(result, {
            onLeft: (err) => {
              toast.error(err.message || 'Failed to update setting.');
              setDateValue(
                initialValue?.value ? DateTime.fromISO(initialValue.value, { zone: 'UTC' }) : null,
              );
              onChange?.(
                initialValue?.value ? DateTime.fromISO(initialValue.value, { zone: 'UTC' }) : null,
              );
            },
            onRight: () => {
              toast.success('Start of re-registration period cleared.');
            },
          });
        }
        return;
      }

      const isoValue = date.toISODate();

      const result = !created
        ? await createConfig.execute({
            key: key,
            value: isoValue ?? '',
            type: 'STRING',
            isPrivate: true,
          })
        : await updateConfig.execute(key, {
            value: isoValue ?? '',
          });

      match(result, {
        onLeft: (err) => {
          toast.error(err.message || 'Failed to update setting.');
          setDateValue(
            initialValue?.value ? DateTime.fromISO(initialValue.value, { zone: 'UTC' }) : null,
          );
        },
        onRight: () => {
          setCreated(true);
          setDateValue(date);
          onChange?.(date);
          toast.success('Start of re-registration period updated.');
        },
      });
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : 'Failed to update setting.');
      setDateValue(
        initialValue?.value ? DateTime.fromISO(initialValue.value, { zone: 'UTC' }) : null,
      );
    } finally {
      setDisabled(false);
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{ bgcolor: 'surfaceContainerHigh.main' }}
      className={`flex w-full justify-start rounded-md p-4 text-left select-text`}
    >
      <Box className="flex-1">
        <Typography
          id="start-reregistration-period-label"
          variant="body1"
          component="p"
          className="font-medium"
        >
          Start of re-registration period
        </Typography>
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
                  'aria-labelledby': 'start-reregistration-period-label',
                },
                htmlInput: {
                  'aria-label': 'Start of re-registration period',
                },
                inputLabel: {
                  hidden: true,
                },
              },
            },
          }}
        />
      </Box>
    </Container>
  );
}
