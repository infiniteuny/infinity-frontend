'use client';

import Image from 'next/image';
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';

type Props = {
  selectedYear?: number;
};

export function LeaderboardHeader({ selectedYear }: Props) {
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
              {selectedYear !== undefined ? `Prestasi ${selectedYear}` : 'Prestasi'}
            </Typography>
            <Typography
              variant="body1"
              className="mt-4 max-w-2xl text-base leading-relaxed text-(--m3-palette-onSurfaceVariant-main)"
            >
              Klasemen anggota INFINITE berdasarkan akumulasi poin kemenangan kompetisi. Pilih
              anggota untuk menelusuri portofolio dan daftar prestasinya.
            </Typography>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }} className="flex justify-center">
          <Image
            src="/assets/images/powerful.svg"
            alt="Ilustrasi Papan Peringkat Prestasi INFINITE UNY"
            width={420}
            height={287}
            className="h-auto w-full max-w-xs object-contain sm:max-w-sm lg:max-w-md"
            priority
          />
        </Grid>
      </Grid>
    </Box>
  );
}
