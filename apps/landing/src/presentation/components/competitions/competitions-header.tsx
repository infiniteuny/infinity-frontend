'use client';

import Image from 'next/image';
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';

export function CompetitionsHeader() {
  return (
    <Box component="section">
      <Grid container spacing={{ xs: 5, lg: 6 }} className="items-center">
        <Grid size={{ xs: 12, lg: 7 }}>
          <Stack className="items-center text-center lg:items-start lg:text-left">
            <Chip label="Program" color="primary" className="mb-4 font-semibold" />
            <Typography
              variant="h2"
              component="h1"
              className="text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl lg:text-5xl"
            >
              Kalender Kompetisi
            </Typography>
            <Typography
              variant="body1"
              className="mt-4 max-w-2xl text-base leading-relaxed text-(--m3-palette-onSurfaceVariant-main)"
            >
              Jelajahi berbagai ajang kompetisi yang sedang berlangsung, akan datang, maupun arsip
              kompetisi terdahulu.
            </Typography>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }} className="flex justify-center">
          <Image
            src="/assets/images/outer-space.svg"
            alt="Ilustrasi Kompetisi INFINITE UNY"
            width={360}
            height={330}
            className="h-auto w-full max-w-60 object-contain sm:max-w-72 lg:max-w-85"
            priority
          />
        </Grid>
      </Grid>
    </Box>
  );
}
