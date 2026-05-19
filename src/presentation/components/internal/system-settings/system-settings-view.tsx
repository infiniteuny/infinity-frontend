'use client';

import { ConfigDto, ConfigMapper } from '@app/infrastructure/dtos';
import { AllowReregistrationTile } from './allow-reregistration-tile';
import { AllowExpiredReregistrationTile } from './allow-expired-reregistration-tile';
import { StartReregistrationPeriodTile } from './start-reregistration-period-tile';
import { EndReregistrationPeriodTile } from './end-reregistration-period-tile';
import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';

type Props = {
  configs: ConfigDto[];
};

export function SystemSettingsView({ configs }: Props) {
  const parsedConfigs = useMemo(() => configs.map(ConfigMapper.fromDtoToDomain), [configs]);
  const allowReregistration = parsedConfigs.find((config) => config.key === 'allow_reregistration');
  const allowExpiredReregistration = parsedConfigs.find(
    (config) => config.key === 'allow_expired_reregistration',
  );
  const startReregistrationPeriod = parsedConfigs.find(
    (config) => config.key === 'start_reregistration_date',
  );
  const endReregistrationPeriod = parsedConfigs.find(
    (config) => config.key === 'end_reregistration_date',
  );

  const [startDate, setStartDate] = useState<DateTime | null>(
    startReregistrationPeriod?.value
      ? DateTime.fromISO(startReregistrationPeriod.value, { zone: 'UTC' })
      : null,
  );
  const [endDate, setEndDate] = useState<DateTime | null>(
    endReregistrationPeriod?.value
      ? DateTime.fromISO(endReregistrationPeriod.value, { zone: 'UTC' })
      : null,
  );

  return (
    <>
      <Box component="section" className="mb-4 w-full px-6">
        <Container maxWidth={false} className="max-w-2xl p-0">
          <Toolbar component="header" className="h-auto min-h-10 p-3">
            <Typography component="h2" variant="h6" className="font-medium">
              Membership
            </Typography>
          </Toolbar>
          <Grid container spacing={0.5}>
            <Grid size={12}>
              <AllowReregistrationTile initialValue={allowReregistration} />
            </Grid>
            <Grid size={12}>
              <AllowExpiredReregistrationTile initialValue={allowExpiredReregistration} />
            </Grid>
            <Grid size={12}>
              <StartReregistrationPeriodTile
                initialValue={startReregistrationPeriod}
                endDate={endDate}
                onChange={setStartDate}
              />
            </Grid>
            <Grid size={12}>
              <EndReregistrationPeriodTile
                initialValue={endReregistrationPeriod}
                startDate={startDate}
                onChange={setEndDate}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
