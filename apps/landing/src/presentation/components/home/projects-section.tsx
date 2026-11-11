'use client';

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { OpenInNewRounded } from '@mui/icons-material';
import { ProjectGallery } from '@infiniteuny/infinity-domain';

type Props = {
  projects: ProjectGallery[];
};

export function ProjectsSection({ projects }: Props) {
  if (projects.length === 0) return null;

  return (
    <Box
      id="projects"
      component="section"
      className="bg-(--m3-palette-surfaceContainerLowest-main) py-20"
    >
      <Container maxWidth="lg">
        <Stack className="mx-auto mb-14 max-w-3xl items-center text-center">
          <Chip label="Karya Anggota" color="primary" size="small" className="mb-3 font-semibold" />
          <Typography
            variant="h3"
            component="h2"
            className="mb-4 text-3xl font-extrabold sm:text-4xl"
          >
            Galeri Produk & Proyek Inovasi
          </Typography>
          <Typography variant="body1" className="text-lg text-(--m3-palette-onSurfaceVariant-main)">
            Berbagai karya aplikasi, riset, dan inovasi digital yang dikembangkan oleh anggota
            komunitas INFINITE UNY.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {projects.map((project) => {
            const imageUrl = typeof project.image === 'string' ? project.image : undefined;
            return (
              <Grid key={project.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card
                  elevation={0}
                  className="flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-(--m3-palette-surfaceContainerHigh-main) p-0 shadow-none"
                >
                  <Box>
                    {imageUrl && (
                      <CardMedia
                        component="img"
                        image={imageUrl}
                        alt={project.title}
                        loading="lazy"
                        className="aspect-video w-full bg-(--m3-palette-surfaceContainerHigh-main) object-cover"
                      />
                    )}
                    <CardContent className="p-6">
                      <Typography variant="h6" className="mb-2 font-bold">
                        {project.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        className="line-clamp-3 text-(--m3-palette-onSurfaceVariant-main)"
                      >
                        {project.description}
                      </Typography>
                    </CardContent>
                  </Box>

                  {project.url && (
                    <CardActions className="px-6 pt-0 pb-6">
                      <Button
                        component="a"
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="tonal"
                        size="small"
                        endIcon={<OpenInNewRounded fontSize="small" />}
                      >
                        Kunjungi Proyek
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
