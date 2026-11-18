'use client';

import Link from 'next/link';
import { ArrowForwardRounded, EmojiEventsOutlined, ShareOutlined } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { CompetitionInstanceDto } from '@infiniteuny/infinity-infrastructure';
import { useState } from 'react';

type Props = {
  instance: CompetitionInstanceDto;
};

type TemporalState = 'ONGOING' | 'UPCOMING' | 'PAST';

function formatDate(iso?: string): string {
  if (!iso) return '-';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function parseCalendarDate(iso?: string): Date | undefined {
  if (!iso) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  date.setHours(0, 0, 0, 0);
  return date;
}

function getTemporalStatus(
  startIso?: string,
  endIso?: string,
): {
  state: TemporalState;
  label: 'Selesai' | 'Akan Datang' | 'Berlangsung';
} {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const start = parseCalendarDate(startIso) ?? now;
  const end = parseCalendarDate(endIso) ?? start;

  if (end.getTime() < now.getTime()) {
    return { state: 'PAST', label: 'Selesai' };
  }

  if (start.getTime() <= now.getTime() && end.getTime() >= now.getTime()) {
    return { state: 'ONGOING', label: 'Berlangsung' };
  }

  return { state: 'UPCOMING', label: 'Akan Datang' };
}

function formatOrganizerTypeLabel(typeName?: string): string | undefined {
  const trimmed = typeName?.trim();
  if (!trimmed) return undefined;
  return /^kompetisi\b/i.test(trimmed) ? trimmed : `Kompetisi ${trimmed}`;
}

export function CompetitionInstanceCard({ instance }: Props) {
  const [copied, setCopied] = useState(false);

  const logoUrl =
    typeof instance.logo === 'string' && instance.logo.trim() !== '' ? instance.logo : undefined;
  const dateFormatted = formatDate(instance.start_date);
  const status = getTemporalStatus(instance.start_date, instance.end_date);
  const organizerTypeLabel = formatOrganizerTypeLabel(instance.organizer_type?.name);
  const organizerText = [instance.organizer?.trim(), organizerTypeLabel]
    .filter(Boolean)
    .join(' - ');
  const detailHref = `/competitions/${instance.id}`;

  const statusChipClass =
    status.state === 'ONGOING'
      ? 'bg-(--m3-palette-primaryContainer-main) text-(--m3-palette-onPrimaryContainer-main)'
      : status.state === 'UPCOMING'
        ? 'bg-(--m3-palette-secondaryContainer-main) text-(--m3-palette-onSecondaryContainer-main)'
        : 'bg-(--m3-palette-surfaceContainer-main) text-(--m3-palette-onSurfaceVariant-main)';

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${detailHref}`;
    const shareData: ShareData = {
      title: instance.name,
      text: organizerText ? `${instance.name} (${organizerText})` : instance.name,
      url: shareUrl,
    };

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <>
      <Card
        elevation={0}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-(--m3-palette-surfaceContainerHigh-main) p-0 shadow-none transition-colors duration-200 hover:bg-(--m3-palette-surfaceContainerHighest-main)"
      >
        <CardContent className="flex flex-1 p-4 sm:p-6">
          <Stack direction="row" className="w-full items-start gap-4 sm:gap-5 lg:gap-6">
            <Avatar
              src={logoUrl}
              alt={instance.name}
              variant="rounded"
              slotProps={{ img: { loading: 'lazy', className: 'h-full w-full object-cover' } }}
              className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-(--m3-palette-surfaceContainer-main) text-(--m3-palette-primary-main) sm:h-32 sm:w-32 lg:h-36 lg:w-36"
            >
              <EmojiEventsOutlined sx={{ fontSize: { xs: 36, sm: 44, lg: 48 } }} />
            </Avatar>

            <Box className="flex h-full min-w-0 flex-1 flex-col justify-between">
              <Box>
                <Stack direction="row" className="flex-wrap items-center gap-2">
                  <Typography
                    variant="caption"
                    className="text-xs font-medium text-(--m3-palette-onSurfaceVariant-main) tabular-nums"
                  >
                    {dateFormatted}
                  </Typography>
                  <Chip
                    label={status.label}
                    size="small"
                    className={`h-6 text-xs font-semibold ${statusChipClass}`}
                  />
                </Stack>

                <Typography
                  variant="h6"
                  component="h3"
                  className="mt-1.5 text-base leading-snug font-bold sm:text-lg"
                >
                  {instance.name}
                </Typography>

                {organizerText && (
                  <Typography
                    variant="body2"
                    className="mt-1 leading-relaxed text-(--m3-palette-onSurfaceVariant-main)"
                  >
                    {organizerText}
                  </Typography>
                )}
              </Box>

              <Stack direction="row" className="mt-4 flex-wrap items-center gap-2">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ShareOutlined sx={{ fontSize: 16 }} />}
                  onClick={handleShare}
                  className="px-3.5 py-1.5"
                >
                  Bagikan
                </Button>

                <Button
                  component={Link}
                  href={detailHref}
                  variant="tonal"
                  size="small"
                  endIcon={<ArrowForwardRounded sx={{ fontSize: 16 }} />}
                  className="px-3.5 py-1.5"
                >
                  Lihat detail
                </Button>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar
        open={copied}
        autoHideDuration={2500}
        onClose={() => setCopied(false)}
        message="Tautan kompetisi berhasil disalin"
      />
    </>
  );
}
