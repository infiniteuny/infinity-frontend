'use client';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { CompetitionInstanceCard } from './competition-instance-card';
import { CompetitionInstanceDto } from '@infiniteuny/infinity-infrastructure';
import { EventBusyOutlined, ExpandMoreRounded, RestartAltRounded } from '@mui/icons-material';

type Props = {
  instances: CompetitionInstanceDto[];
  isLoading?: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
};

export function CompetitionsGrid({
  instances,
  isLoading = false,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  hasActiveFilters = false,
  onResetFilters,
}: Props) {
  return (
    <Box component="section">
      {isLoading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, md: 6 }}>
              <Card
                elevation={0}
                className="rounded-3xl bg-(--m3-palette-surfaceContainerHigh-main) p-0 shadow-none"
              >
                <CardContent className="p-4 sm:p-6">
                  <Stack direction="row" className="w-full items-start gap-4 sm:gap-5 lg:gap-6">
                    <Skeleton
                      variant="rounded"
                      className="h-24 w-24 shrink-0 rounded-2xl sm:h-32 sm:w-32 lg:h-36 lg:w-36"
                    />
                    <Box className="min-w-0 flex-1">
                      <Stack direction="row" className="items-center gap-2">
                        <Skeleton variant="text" width={72} height={20} />
                        <Skeleton
                          variant="rounded"
                          width={76}
                          height={24}
                          className="rounded-full"
                        />
                      </Stack>
                      <Skeleton variant="text" width="85%" height={28} className="mt-1.5" />
                      <Skeleton variant="text" width="65%" height={22} className="mt-1" />
                      <Stack direction="row" className="mt-4 items-center gap-2">
                        <Skeleton
                          variant="rounded"
                          width={92}
                          height={32}
                          className="rounded-full"
                        />
                        <Skeleton
                          variant="rounded"
                          width={112}
                          height={32}
                          className="rounded-full"
                        />
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : instances.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {instances.map((instance) => (
              <Grid key={instance.id} size={{ xs: 12, md: 6 }}>
                <CompetitionInstanceCard instance={instance} />
              </Grid>
            ))}
          </Grid>

          {hasMore && onLoadMore && (
            <Stack className="mt-8 items-center">
              <Button
                variant="tonal"
                size="large"
                disabled={isLoadingMore}
                endIcon={
                  isLoadingMore ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <ExpandMoreRounded />
                  )
                }
                onClick={onLoadMore}
              >
                {isLoadingMore ? 'Memuat...' : 'Tampilkan Lainnya'}
              </Button>
            </Stack>
          )}
        </>
      ) : (
        <Card
          elevation={0}
          className="rounded-3xl bg-(--m3-palette-surfaceContainerHigh-main) p-0 shadow-none"
        >
          <CardContent className="p-10 text-center sm:p-14">
            <Stack className="mx-auto max-w-md items-center">
              <Avatar
                variant="rounded"
                className="mb-4 h-14 w-14 rounded-2xl bg-(--m3-palette-surfaceContainer-main) text-(--m3-palette-onSurfaceVariant-main)"
              >
                <EventBusyOutlined />
              </Avatar>
              <Typography variant="h6" className="font-bold">
                {hasActiveFilters
                  ? 'Tidak ada kompetisi yang sesuai filter'
                  : 'Belum ada kompetisi aktif atau mendatang'}
              </Typography>
              <Typography
                variant="body2"
                className="mt-1.5 text-(--m3-palette-onSurfaceVariant-main)"
              >
                {hasActiveFilters
                  ? 'Coba ubah kata kunci pencarian atau pilih status pelaksanaan lainnya.'
                  : 'Daftar kompetisi yang sedang berlangsung maupun akan datang akan ditampilkan di halaman ini.'}
              </Typography>
              {hasActiveFilters && onResetFilters && (
                <Button
                  variant="tonal"
                  size="small"
                  startIcon={<RestartAltRounded fontSize="small" />}
                  onClick={onResetFilters}
                  className="mt-5"
                >
                  Reset Filter
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
