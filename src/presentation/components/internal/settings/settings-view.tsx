'use client';

import { Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import { SettingTile } from './setting-tile';
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

export function SettingsView() {
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
            <Grid size={12}>
              <SettingTile
                title="System Configurations"
                subtitle="General system-wide settings and configurations"
                icon={<TuneRounded />}
                trailingIcon={<ChevronRightRounded />}
                href="/settings/system"
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box component="section" className="mb-4 w-full px-6">
        <Container maxWidth={false} className="max-w-2xl p-0">
          <Toolbar component="header" className="h-auto min-h-10 p-3">
            <Typography component="h2" variant="h6" className="font-medium">
              Directories
            </Typography>
          </Toolbar>
          <Grid container spacing={0.5}>
            <Grid size={12}>
              <SettingTile
                title="Degrees"
                subtitle="Academic degrees"
                position="top"
                icon={<StairsRounded />}
                trailingIcon={<ChevronRightRounded />}
                href="/degrees"
              />
            </Grid>
            <Grid size={12}>
              <SettingTile
                title="Faculties"
                subtitle="Academic faculties"
                position="middle"
                icon={<SchoolRounded />}
                trailingIcon={<ChevronRightRounded />}
                href="/faculties"
              />
            </Grid>
            <Grid size={12}>
              <SettingTile
                title="Majors"
                subtitle="Academic majors"
                position="middle"
                icon={<AdjustRounded />}
                trailingIcon={<ChevronRightRounded />}
                href="/majors"
              />
            </Grid>
            <Grid size={12}>
              <SettingTile
                title="Personas"
                subtitle="User personas"
                position="middle"
                icon={<AssignmentIndRounded />}
                trailingIcon={<ChevronRightRounded />}
                href="/personas"
              />
            </Grid>
            <Grid size={12}>
              <SettingTile
                title="Team Types"
                subtitle="Types of teams"
                position="bottom"
                icon={<GroupsRounded />}
                trailingIcon={<ChevronRightRounded />}
                href="/team-types"
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box component="section" className="mb-4 w-full px-6">
        <Container maxWidth={false} className="max-w-2xl p-0">
          <Toolbar component="header" className="h-auto min-h-10 p-3">
            <Typography component="h2" variant="h6" className="font-medium">
              Communities
            </Typography>
          </Toolbar>
          <Grid container spacing={0.5}>
            <Grid size={12}>
              <SettingTile
                title="Core Team Divisions"
                subtitle="Divisions within the core team"
                position="top"
                icon={<Groups3Rounded />}
                trailingIcon={<ChevronRightRounded />}
                href="/core-team-divisions"
              />
            </Grid>
            <Grid size={12}>
              <SettingTile
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
          <Grid container spacing={0.5}>
            <Grid size={12}>
              <SettingTile
                title="Competitions"
                subtitle="List of competitions and their details"
                position="top"
                icon={<EmojiEventsRounded />}
                trailingIcon={<ChevronRightRounded />}
                href="/competitions"
              />
            </Grid>
            <Grid size={12}>
              <SettingTile
                title="Organizer Types"
                subtitle="Types of competition organizers"
                position="middle"
                icon={<BusinessRounded />}
                trailingIcon={<ChevronRightRounded />}
                href="/competition-organizer-types"
              />
            </Grid>
            <Grid size={12}>
              <SettingTile
                title="Scales"
                subtitle="Regional level of the competition"
                position="middle"
                icon={<SquareFootRounded />}
                trailingIcon={<ChevronRightRounded />}
                href="/competition-scales"
              />
            </Grid>
            <Grid size={12}>
              <SettingTile
                title="Time Ranges"
                subtitle="Duration of the competition"
                position="middle"
                icon={<TimelapseRounded />}
                trailingIcon={<ChevronRightRounded />}
                href="/competition-time-ranges"
              />
            </Grid>
            <Grid size={12}>
              <SettingTile
                title="Outputs"
                subtitle="Types of outputs produced by the competition"
                position="middle"
                icon={<CategoryRounded />}
                trailingIcon={<ChevronRightRounded />}
                href="/competition-outputs"
              />
            </Grid>
            <Grid size={12}>
              <SettingTile
                title="Ranks"
                subtitle="Winning ranks in the competition"
                position="bottom"
                icon={<WorkspacePremiumRounded />}
                trailingIcon={<ChevronRightRounded />}
                href="/competition-ranks"
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
