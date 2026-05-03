import Link from 'next/link';
import { Box, Container, Grid, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { CommunityGroupAdminMember } from '@app/domain/entities';
import { DownloadRounded } from '@mui/icons-material';
import { ViewTile } from '@app/presentation/components/internal/shared';

type Props = {
  communityGroupAdminMember: CommunityGroupAdminMember;
};

export function GeneralView({ communityGroupAdminMember }: Props) {
  return (
    <Box component="section" className="mb-4 w-full px-6">
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Toolbar component="header" className="h-auto min-h-10 p-3">
          <Typography component="h2" variant="h6" className="font-medium">
            General
          </Typography>
        </Toolbar>
        <Grid container spacing={0.5}>
          <Grid size={12}>
            <ViewTile title="Name" subtitle={communityGroupAdminMember.name} position="top" />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Community Group"
              subtitle={communityGroupAdminMember.membership.communityGroup?.name ?? 'N/A'}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <Container
              maxWidth={false}
              sx={{ bgcolor: 'surfaceContainerHigh.main' }}
              className={`${communityGroupAdminMember.membership.animation ? 'rounded-md' : 'rounded-t-md rounded-b-2xl'} p-4`}
            >
              <Typography variant="body1" component="p" className="font-medium">
                Photo
              </Typography>
              <Box
                sx={{ borderColor: 'outline' }}
                className="mt-2 w-full rounded-lg border border-solid p-4"
              >
                <Box className="flex flex-row items-center justify-between gap-2">
                  <Typography
                    variant="body2"
                    color="onSurfaceVariant.main"
                    className="font-semibold"
                  >
                    Photo
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {typeof communityGroupAdminMember.membership.photo === 'string' ? (
                      <>
                        <IconButton
                          component="a"
                          LinkComponent={Link}
                          href={communityGroupAdminMember.membership.photo}
                          download="photo.jpg"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Download photo"
                          title="Download"
                        >
                          <DownloadRounded fontSize="small" />
                        </IconButton>
                      </>
                    ) : null}
                  </Stack>
                </Box>
              </Box>
              <Box
                component="img"
                src={communityGroupAdminMember.membership.photo as string}
                alt={`${communityGroupAdminMember.name}'s photo`}
                sx={{
                  width: '100%',
                  maxHeight: 280,
                  objectFit: 'contain',
                }}
                className="mt-2"
              />
            </Container>
          </Grid>
          {communityGroupAdminMember.membership.animation ? (
            <Grid size={12}>
              <Container
                maxWidth={false}
                sx={{ bgcolor: 'surfaceContainerHigh.main' }}
                className="rounded-md p-4"
              >
                <Typography variant="body1" component="p" className="font-medium">
                  Animation
                </Typography>
                <Box
                  sx={{ borderColor: 'outline' }}
                  className="mt-2 w-full rounded-lg border border-solid p-4"
                >
                  <Box className="flex flex-row items-center justify-between gap-2">
                    <Typography
                      variant="body2"
                      color="onSurfaceVariant.main"
                      className="font-semibold"
                    >
                      Animation
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      {typeof communityGroupAdminMember.membership.animation === 'string' ? (
                        <>
                          <IconButton
                            component="a"
                            LinkComponent={Link}
                            href={communityGroupAdminMember.membership.animation}
                            download="animation.jpg"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Download animation"
                            title="Download"
                          >
                            <DownloadRounded fontSize="small" />
                          </IconButton>
                        </>
                      ) : null}
                    </Stack>
                  </Box>
                </Box>
                <Box
                  component="img"
                  src={communityGroupAdminMember.membership.animation as string}
                  alt={`${communityGroupAdminMember.name}'s animation`}
                  sx={{
                    width: '100%',
                    maxHeight: 280,
                    objectFit: 'contain',
                  }}
                  className="mt-2"
                />
              </Container>
            </Grid>
          ) : null}
        </Grid>
      </Container>
    </Box>
  );
}
