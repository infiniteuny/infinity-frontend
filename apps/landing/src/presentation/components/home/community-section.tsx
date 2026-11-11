'use client';

import Image from 'next/image';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { CodeRounded, GroupsOutlined } from '@mui/icons-material';
import { CommunityGroup, Persona } from '@infiniteuny/infinity-domain';

type Props = {
  personas: Persona[];
  communityGroups: CommunityGroup[];
};

export function CommunitySection({ personas, communityGroups }: Props) {
  return (
    <Box id="community" component="section" className="py-20">
      <Container maxWidth="lg">
        <Grid container spacing={5} className="mb-16 items-center">
          <Grid size={{ xs: 12, lg: 7 }}>
            <Chip label="Komunitas" color="primary" size="small" className="mb-3 font-semibold" />
            <Typography
              variant="h3"
              component="h2"
              className="mb-4 text-3xl font-extrabold sm:text-4xl"
            >
              Persona & Grup
            </Typography>
            <Typography
              variant="body1"
              className="text-base leading-relaxed text-(--m3-palette-onSurfaceVariant-main)"
            >
              Kembangkan minat dan bakat terbaikmu dalam membangun inovasi teknologi melalui peran
              sebagai Hustler, Hipster, atau Hacker serta grup komunitas di INFINITE.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }} className="flex justify-center">
            <Image
              src="/assets/images/roles.svg"
              alt="Peran dan Komunitas INFINITE UNY"
              width={360}
              height={280}
              className="h-auto max-w-full"
            />
          </Grid>
        </Grid>

        {/* Personas */}
        {personas.length > 0 && (
          <Box id="personas" className="mb-20 scroll-mt-24">
            <Stack className="mb-8 items-start">
              <Typography variant="h5" component="h3" className="text-2xl font-extrabold">
                Persona
              </Typography>
              <Typography
                variant="body2"
                className="mt-1 text-(--m3-palette-onSurfaceVariant-main)"
              >
                Tiga pilar utama dalam merancang dan mengembangkan produk teknologi.
              </Typography>
            </Stack>

            <Grid container spacing={3}>
              {personas.map((persona) => {
                const logoUrl =
                  typeof persona.logo === 'string' && persona.logo.trim() !== ''
                    ? persona.logo
                    : undefined;

                return (
                  <Grid key={persona.id} size={{ xs: 12, md: 4 }}>
                    <Card
                      elevation={0}
                      className="group flex h-full flex-col rounded-3xl bg-(--m3-palette-surfaceContainerHigh-main) p-0 shadow-none transition-colors duration-300 hover:bg-(--m3-palette-surfaceContainerHighest-main)"
                    >
                      <CardContent className="flex flex-1 flex-col p-7 sm:p-8">
                        <Avatar
                          src={logoUrl}
                          alt={persona.name}
                          variant="rounded"
                          className="mb-6 h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-(--m3-palette-primaryContainer-main) text-(--m3-palette-onPrimaryContainer-main) [&_img]:transition-transform [&_img]:duration-300 [&_img]:ease-out group-hover:[&_img]:scale-105"
                        >
                          <CodeRounded fontSize="large" />
                        </Avatar>

                        <Typography
                          variant="h5"
                          component="h4"
                          className="mb-2.5 text-2xl font-extrabold tracking-tight text-(--m3-palette-onSurface-main)"
                        >
                          {persona.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          className="leading-relaxed text-(--m3-palette-onSurfaceVariant-main)"
                        >
                          {persona.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {communityGroups.length > 0 && (
          <Box id="groups" className="scroll-mt-24">
            <Stack className="mb-8 items-start">
              <Typography variant="h5" component="h3" className="text-2xl font-extrabold">
                Grup Komunitas
              </Typography>
              <Typography
                variant="body2"
                className="mt-1 text-(--m3-palette-onSurfaceVariant-main)"
              >
                Wadah pendalaman dan eksplorasi teknologi sesuai minat spesialisasi.
              </Typography>
            </Stack>

            <Grid container spacing={3}>
              {communityGroups.map((group) => {
                const logoUrl =
                  typeof group.logo === 'string' && group.logo.trim() !== ''
                    ? group.logo
                    : undefined;

                return (
                  <Grid key={group.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <Card
                      elevation={0}
                      className="group flex h-full flex-col rounded-3xl bg-(--m3-palette-surfaceContainerHigh-main) p-0 shadow-none transition-colors duration-300 hover:bg-(--m3-palette-surfaceContainerHighest-main)"
                    >
                      <CardContent className="flex flex-1 flex-col p-6 sm:p-7">
                        <Stack direction="row" spacing={2} className="mb-4 items-center">
                          <Avatar
                            src={logoUrl}
                            alt={group.name}
                            variant="rounded"
                            className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-(--m3-palette-secondaryContainer-main) text-(--m3-palette-onSecondaryContainer-main) [&_img]:transition-transform [&_img]:duration-300 [&_img]:ease-out group-hover:[&_img]:scale-105"
                          >
                            <GroupsOutlined />
                          </Avatar>

                          <Typography
                            variant="h6"
                            component="h4"
                            className="text-lg leading-snug font-bold tracking-tight text-(--m3-palette-onSurface-main)"
                          >
                            {group.name}
                          </Typography>
                        </Stack>

                        <Typography
                          variant="body2"
                          className="leading-relaxed text-(--m3-palette-onSurfaceVariant-main)"
                        >
                          {group.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}
