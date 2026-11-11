'use client';

import NextLink from 'next/link';
import { ArrowForwardRounded } from '@mui/icons-material';
import { Box, Button, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import { InfiniteLogo3D } from '@infiniteuny/infinity-ui';

export function HeroSection() {
  return (
    <Box id="hero" component="section" className="relative overflow-hidden py-16 md:py-24 lg:py-28">
      <Container maxWidth="lg" className="relative z-10">
        <Grid container spacing={6} className="items-center">
          <Grid size={{ xs: 12, lg: 7 }}>
            <Chip
              label="Divisi Teknologi Informasi INFINITE"
              color="primary"
              variant="outlined"
              className="mb-6 rounded-full px-2 font-semibold"
            />
            <Typography
              variant="h2"
              component="h1"
              className="mb-6 text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Let&apos;s Make{' '}
              <Box component="span" className="text-(--m3-palette-primary-main)">
                Infinite
              </Box>{' '}
              Technology!
            </Typography>
            <Typography
              variant="h6"
              className="mb-8 max-w-2xl text-base leading-relaxed font-normal text-(--m3-palette-onSurfaceVariant-main)"
            >
              Tempat berkumpul para pecinta teknologi&nbsp;🤝
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} className="gap-4">
              <Button component={NextLink} href="/#contacts" variant="filled" size="large">
                Hubungi kami
              </Button>
              <Button
                component={NextLink}
                href="/#about"
                variant="outlined"
                size="large"
                endIcon={<ArrowForwardRounded />}
              >
                Kenali INFINITE
              </Button>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }} className="flex justify-center">
            <InfiniteLogo3D className="max-w-sm lg:max-w-[420px]" />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
