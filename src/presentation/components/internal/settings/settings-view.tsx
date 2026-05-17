'use client';

import {
  AdjustRounded,
  AssignmentIndRounded,
  BusinessRounded,
  CategoryRounded,
  ChevronRightRounded,
  Diversity2Rounded,
  EmojiEventsRounded,
  Groups3Rounded,
  GroupsRounded,
  SchoolRounded,
  SquareFootRounded,
  StairsRounded,
  TimelapseRounded,
  TuneRounded,
  WorkspacePremiumRounded,
} from '@mui/icons-material';
import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { ClickableViewTile } from '@app/presentation/components/internal/shared';
import { useInternalStore } from '@app/presentation/hooks';

export function SettingsView() {
  const userPermissions = new Set(useInternalStore((s) => s.session?.permissions ?? []));

  return (
    <>
      <Box component="section" className="mb-4 w-full px-6">
        <Container maxWidth={false} className="max-w-2xl p-0">
          <Toolbar component="header" className="h-auto min-h-10 p-3">
            <Typography component="h2" variant="h6" className="font-medium">
              General
            </Typography>
          </Toolbar>
          <Grid container spacing={0.5}>
            {['create-config', 'update-config', 'delete-config'].some((p) =>
              userPermissions.has(p),
            ) ? (
              <Grid size={12}>
                <ClickableViewTile
                  title="System Configurations"
                  subtitle="General system-wide settings and configurations"
                  icon={<TuneRounded />}
                  trailingIcon={<ChevronRightRounded />}
                  href="/settings/system"
                />
              </Grid>
            ) : null}
          </Grid>
        </Container>
      </Box>
      {[
        'read-degree',
        'read-faculty',
        'read-major',
        'read-persona',
        'read-competition-team-type',
      ].some((p) => userPermissions.has(p)) ? (
        <Box component="section" className="mb-4 w-full px-6">
          <Container maxWidth={false} className="max-w-2xl p-0">
            <Toolbar component="header" className="h-auto min-h-10 p-3">
              <Typography component="h2" variant="h6" className="font-medium">
                Directories
              </Typography>
            </Toolbar>
            <Grid container spacing={0.5} className="tiles-rounded-dynamic">
              {['read-degree'].some((p) => userPermissions.has(p)) ? (
                <Grid size={12}>
                  <ClickableViewTile
                    title="Degrees"
                    subtitle="Academic degrees"
                    position="top"
                    icon={<StairsRounded />}
                    trailingIcon={<ChevronRightRounded />}
                    href="/degrees"
                  />
                </Grid>
              ) : null}
              {['read-faculty'].some((p) => userPermissions.has(p)) ? (
                <Grid size={12}>
                  <ClickableViewTile
                    title="Faculties"
                    subtitle="Academic faculties"
                    position="middle"
                    icon={<SchoolRounded />}
                    trailingIcon={<ChevronRightRounded />}
                    href="/faculties"
                  />
                </Grid>
              ) : null}
              {['read-major'].some((p) => userPermissions.has(p)) ? (
                <Grid size={12}>
                  <ClickableViewTile
                    title="Majors"
                    subtitle="Academic majors"
                    position="middle"
                    icon={<AdjustRounded />}
                    trailingIcon={<ChevronRightRounded />}
                    href="/majors"
                  />
                </Grid>
              ) : null}
              {['read-persona'].some((p) => userPermissions.has(p)) ? (
                <Grid size={12}>
                  <ClickableViewTile
                    title="Personas"
                    subtitle="User personas"
                    position="middle"
                    icon={<AssignmentIndRounded />}
                    trailingIcon={<ChevronRightRounded />}
                    href="/personas"
                  />
                </Grid>
              ) : null}
              {['read-competition-team-type'].some((p) => userPermissions.has(p)) ? (
                <Grid size={12}>
                  <ClickableViewTile
                    title="Team Types"
                    subtitle="Types of teams"
                    position="bottom"
                    icon={<GroupsRounded />}
                    trailingIcon={<ChevronRightRounded />}
                    href="/team-types"
                  />
                </Grid>
              ) : null}
            </Grid>
          </Container>
        </Box>
      ) : null}
      <Box component="section" className="mb-4 w-full px-6">
        <Container maxWidth={false} className="max-w-2xl p-0">
          <Toolbar component="header" className="h-auto min-h-10 p-3">
            <Typography component="h2" variant="h6" className="font-medium">
              Communities
            </Typography>
          </Toolbar>
          <Grid container spacing={0.5} className="tiles-rounded-dynamic">
            {['read-core-team-division'].some((p) => userPermissions.has(p)) ? (
              <Grid size={12}>
                <ClickableViewTile
                  title="Core Team Divisions"
                  subtitle="Divisions within the core team"
                  position="top"
                  icon={<Groups3Rounded />}
                  trailingIcon={<ChevronRightRounded />}
                  href="/core-team-divisions"
                />
              </Grid>
            ) : null}
            <Grid size={12}>
              <ClickableViewTile
                title="Community Groups"
                subtitle="Groups within the community"
                position="bottom"
                icon={<Diversity2Rounded />}
                trailingIcon={<ChevronRightRounded />}
                href="/community-groups"
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box component="section" className="mb-6 w-full px-6">
        <Container maxWidth={false} className="max-w-2xl p-0">
          <Toolbar component="header" className="h-auto min-h-10 p-3">
            <Typography component="h2" variant="h6" className="font-medium">
              Competitions
            </Typography>
          </Toolbar>
          <Grid container spacing={0.5} className="tiles-rounded-dynamic">
            <Grid size={12}>
              <ClickableViewTile
                title="Competitions"
                subtitle="List of competitions and their details"
                position="top"
                icon={<EmojiEventsRounded />}
                trailingIcon={<ChevronRightRounded />}
                href="/competitions"
              />
            </Grid>
            {['read-competition-organizer-type'].some((p) => userPermissions.has(p)) ? (
              <Grid size={12}>
                <ClickableViewTile
                  title="Organizer Types"
                  subtitle="Types of competition organizers"
                  position="middle"
                  icon={<BusinessRounded />}
                  trailingIcon={<ChevronRightRounded />}
                  href="/competition-organizer-types"
                />
              </Grid>
            ) : null}
            {['read-competition-scale'].some((p) => userPermissions.has(p)) ? (
              <Grid size={12}>
                <ClickableViewTile
                  title="Scales"
                  subtitle="Regional level of the competition"
                  position="middle"
                  icon={<SquareFootRounded />}
                  trailingIcon={<ChevronRightRounded />}
                  href="/competition-scales"
                />
              </Grid>
            ) : null}
            {['read-competition-time-range'].some((p) => userPermissions.has(p)) ? (
              <Grid size={12}>
                <ClickableViewTile
                  title="Time Ranges"
                  subtitle="Duration of the competition"
                  position="middle"
                  icon={<TimelapseRounded />}
                  trailingIcon={<ChevronRightRounded />}
                  href="/competition-time-ranges"
                />
              </Grid>
            ) : null}
            {['read-competition-output'].some((p) => userPermissions.has(p)) ? (
              <Grid size={12}>
                <ClickableViewTile
                  title="Outputs"
                  subtitle="Types of outputs produced by the competition"
                  position="middle"
                  icon={<CategoryRounded />}
                  trailingIcon={<ChevronRightRounded />}
                  href="/competition-outputs"
                />
              </Grid>
            ) : null}
            {['read-competition-rank'].some((p) => userPermissions.has(p)) ? (
              <Grid size={12}>
                <ClickableViewTile
                  title="Ranks"
                  subtitle="Winning ranks in the competition"
                  position="bottom"
                  icon={<WorkspacePremiumRounded />}
                  trailingIcon={<ChevronRightRounded />}
                  href="/competition-ranks"
                />
              </Grid>
            ) : null}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
