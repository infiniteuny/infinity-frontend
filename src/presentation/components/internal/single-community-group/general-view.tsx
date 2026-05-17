import Link from 'next/link';
import { Box, Container, Grid, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { ChevronRightRounded, DownloadRounded } from '@mui/icons-material';
import { ClickableViewTile, ViewTile } from '@app/presentation/components/internal/shared';
import { CommunityGroup } from '@app/domain/entities';

type Props = {
  communityGroup: CommunityGroup;
};

export function GeneralView({ communityGroup }: Props) {
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
            <ViewTile title="Name" subtitle={communityGroup.name} position="top" />
          </Grid>
          <Grid size={12}>
            <ViewTile title="Description" subtitle={communityGroup.description} position="middle" />
          </Grid>
          <Grid size={12}>
            <ViewTile title="Priority" subtitle={communityGroup.priority} position="middle" />
          </Grid>
          <Grid size={12}>
            <ViewTile
              title="Active"
              subtitle={communityGroup.isActive ? 'Yes' : 'No'}
              position="middle"
            />
          </Grid>
          <Grid size={12}>
            <Container
              maxWidth={false}
              sx={{ bgcolor: 'surfaceContainerHigh.main' }}
              className="rounded-md p-4"
            >
              <Typography variant="body1" component="p" className="font-medium">
                Image
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
                    Image
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {typeof communityGroup.logo === 'string' ? (
                      <>
                        <IconButton
                          component="a"
                          LinkComponent={Link}
                          href={communityGroup.logo}
                          download="logo.jpg"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Download logo"
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
                src={communityGroup.logo as string}
                alt={communityGroup.name}
                sx={{
                  width: '100%',
                  maxHeight: 280,
                  objectFit: 'contain',
                }}
                className="mt-2"
              />
            </Container>
          </Grid>
          <Grid size={12}>
            <ClickableViewTile
              title="Members"
              subtitle="View and manage community group members"
              trailingIcon={<ChevronRightRounded />}
              href={`/community-groups/${communityGroup.id}/members`}
              position="bottom"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
