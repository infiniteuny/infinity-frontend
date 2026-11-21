'use client';

import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { ViewTile } from './view-tile';

type ExtraItem = {
  title: string;
  subtitle: string | number;
};

type Props = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  extraItems?: ExtraItem[];
};

const METADATA_DATE_FORMAT = 'cccc, d LLLL yyyy, HH:mm:ss ZZZZ';

export function EntityMetadataView({ id, createdAt, updatedAt, extraItems }: Props) {
  return (
    <Box component="section" className="mb-6 w-full px-6">
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Toolbar component="header" className="h-auto min-h-10 p-3">
          <Typography component="h2" variant="h6" className="font-medium">
            Metadata
          </Typography>
        </Toolbar>
        <Grid container spacing={0.5}>
          <Grid size={12}>
            <ViewTile title="ID" subtitle={id} position="top" />
          </Grid>
          {extraItems?.map((item) => (
            <Grid key={item.title} size={12}>
              <ViewTile title={item.title} subtitle={item.subtitle} position="middle" />
            </Grid>
          ))}
          <Grid size={12}>
            <ViewTile
              title="Created At"
              subtitle={DateTime.fromJSDate(createdAt).toFormat(METADATA_DATE_FORMAT)}
              position="middle"
              suppressSubtitleHydrationWarning
            />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Updated At"
              subtitle={DateTime.fromJSDate(updatedAt).toFormat(METADATA_DATE_FORMAT)}
              position="bottom"
              suppressSubtitleHydrationWarning
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
