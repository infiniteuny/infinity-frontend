'use client';

import { APP } from '@config';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import { CloseRounded, PlayArrowRounded } from '@mui/icons-material';
import { useState } from 'react';

type Props = {
  communityGroupsCount: number;
  memberCount: number;
  achievementCount: number;
  projectsCount: number;
};

export function FunfactsSection({
  communityGroupsCount,
  memberCount,
  achievementCount,
  projectsCount,
}: Props) {
  const [videoOpen, setVideoOpen] = useState(false);

  const funfacts = [
    { value: String(communityGroupsCount || 7), label: 'Grup Komunitas' },
    { value: String(memberCount), label: 'Anggota Terdaftar' },
    { value: String(achievementCount), label: 'Penghargaan Lomba' },
    { value: `${projectsCount || 10}+`, label: 'Karya & Proyek' },
  ];

  return (
    <Box component="section" className="py-20">
      <Container maxWidth="lg">
        <Card
          elevation={0}
          className="overflow-hidden rounded-4xl bg-(--m3-palette-primaryContainer-main) p-0 text-(--m3-palette-onPrimaryContainer-main) shadow-none"
        >
          <CardContent className="p-8 sm:p-12">
            <Grid container spacing={4} className="items-center">
              <Grid size={{ xs: 12, lg: 7 }}>
                <Typography
                  variant="h3"
                  component="h2"
                  className="mb-4 text-3xl font-extrabold sm:text-4xl"
                >
                  Tumbuh Bersama Komunitas Teknologi Terbesar di UNY
                </Typography>
                <Typography variant="body1" className="mb-6 text-base opacity-90">
                  Saksikan bagaimana perjalanan anggota INFINITE dalam belajar, berkolaborasi,
                  berkarya, berkompetisi, dan berkarir menciptakan solusi teknologi yang berdampak.
                </Typography>
                <Button
                  variant="filled"
                  size="large"
                  startIcon={<PlayArrowRounded />}
                  onClick={() => setVideoOpen(true)}
                >
                  Putar Video Profil
                </Button>
              </Grid>

              <Grid size={{ xs: 12, lg: 5 }}>
                <Box className="grid auto-rows-fr grid-cols-2 gap-4">
                  {funfacts.map((item) => (
                    <Paper
                      key={item.label}
                      elevation={0}
                      className="flex h-full min-h-36 w-full flex-col items-center justify-center rounded-3xl bg-(--m3-palette-surfaceContainerLowest-main) p-6 text-center text-(--m3-palette-onSurface-main)"
                    >
                      <Typography
                        variant="h3"
                        className="font-extrabold text-(--m3-palette-primary-main)"
                      >
                        {item.value}
                      </Typography>
                      <Typography variant="body2" className="mt-1 font-semibold text-balance">
                        {item.label}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <Dialog open={videoOpen} onClose={() => setVideoOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle className="flex items-center justify-between px-4 py-2 font-bold">
          Video Profil INFINITE UNY
          <IconButton onClick={() => setVideoOpen(false)} aria-label="Tutup video">
            <CloseRounded />
          </IconButton>
        </DialogTitle>
        <DialogContent className="p-0">
          <Box
            component="iframe"
            src={APP.site.youtubeEmbedUrl}
            title="INFINITE UNY Video"
            className="aspect-video w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
