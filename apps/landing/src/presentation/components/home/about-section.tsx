'use client';

import Image from 'next/image';
import {
  AutoGraphRounded,
  EmojiEventsOutlined,
  PsychologyAltRounded,
  RocketLaunchRounded,
  SchoolRounded,
} from '@mui/icons-material';
import { Avatar, Box, Card, CardContent, Chip, Container, Grid, Typography } from '@mui/material';

const ABOUT_POINTS = [
  {
    icon: SchoolRounded,
    title: 'Mentoring Rutin',
    description:
      'Kurikulum belajar terstruktur bersama mentor berpengalaman pada berbagai fokus keahlian teknologi informasi.',
  },
  {
    icon: PsychologyAltRounded,
    title: 'Kolaborasi Lintas Disiplin',
    description:
      'Sinergi antar mahasiswa dari berbagai latar belakang program studi dengan peran Hustler, Hipster, dan Hacker.',
  },
  {
    icon: RocketLaunchRounded,
    title: 'Inkubasi Produk Teknologi',
    description:
      'Membangun produk teknologi informasi nyata mulai dari perancangan ide bisnis, riset pengguna, desain antarmuka, hingga deployment.',
  },
  {
    icon: EmojiEventsOutlined,
    title: 'Pembinaan Kompetisi TI Nasional & Internasional',
    description:
      'Pendampingan intensif untuk berbagai ajang kompetisi teknologi informasi bergengsi seperti PKM, GEMASTIK, LIDM, dan Hackathon.',
  },
  {
    icon: AutoGraphRounded,
    title: 'Perencanaan Karir & Jejaring Alumni',
    description:
      'Wadah berbagi pengalaman, tips, dan strategi pengembangan karir di bidang teknologi informasi bersama alumni dan praktisi industri.',
  },
];

export function AboutSection() {
  return (
    <Box
      id="about"
      component="section"
      className="bg-(--m3-palette-surfaceContainerLowest-main) py-20"
    >
      <Container maxWidth="lg">
        <Grid container spacing={5} className="mb-14 items-center">
          <Grid size={{ xs: 12, lg: 5 }} className="flex justify-center">
            <Image
              src="/assets/images/about.svg"
              alt="Tentang INFINITE UNY"
              width={380}
              height={300}
              className="h-auto max-w-full"
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Chip
              label="Tentang Kami"
              color="primary"
              size="small"
              className="mb-3 font-semibold"
            />
            <Typography
              variant="h3"
              component="h2"
              className="mb-4 text-3xl font-extrabold sm:text-4xl"
            >
              Wadah Kolaborasi & Akselerasi Talenta Digital UNY
            </Typography>
            <Typography
              variant="body1"
              className="text-base leading-relaxed text-(--m3-palette-onSurfaceVariant-main)"
            >
              INFINITE merupakan Divisi Teknologi Informasi di bawah naungan UKM Rekayasa Teknologi.
              Sejak tahun 2014, INFINITE hadir sebagai ruang tumbuh bersama bagi mahasiswa dari
              berbagai program studi di Universitas Negeri Yogyakarta yang ingin mendalami minat dan
              bakat di bidang Teknologi Informasi melalui pendekatan berbasis proyek dan kompetisi.
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {ABOUT_POINTS.map((item) => {
            const Icon = item.icon;
            return (
              <Grid key={item.title} size={{ xs: 12, md: 6, lg: 4 }}>
                <Card
                  elevation={0}
                  className="h-full rounded-3xl bg-(--m3-palette-surfaceContainerHigh-main) p-0 shadow-none"
                >
                  <CardContent className="p-6">
                    <Avatar
                      variant="rounded"
                      className="mb-4 h-12 w-12 rounded-2xl bg-(--m3-palette-primaryContainer-main) text-(--m3-palette-onPrimaryContainer-main)"
                    >
                      <Icon />
                    </Avatar>
                    <Typography variant="h6" className="mb-2 font-bold">
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-sm leading-relaxed text-(--m3-palette-onSurfaceVariant-main)"
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
