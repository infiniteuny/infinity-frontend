'use client';

import NextLink from 'next/link';
import { Box, Card, CardMedia, Chip, Stack, Typography } from '@mui/material';
import { CoreTeamMemberDto } from '@infiniteuny/infinity-infrastructure';
import { PersonOutlineRounded } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';

type Props = {
  member: CoreTeamMemberDto;
};

function getChipTextSizeClass(text: string): string {
  if (text.length > 30) return 'text-[10px] tracking-tighter';
  if (text.length > 24) return 'text-[10.5px] tracking-tight';
  if (text.length > 18) return 'text-[11px] tracking-tight';
  return 'text-xs';
}

export function CoreTeamMemberCard({ member }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const chipRef = useRef<HTMLDivElement | null>(null);

  const staticPhoto =
    typeof member.membership?.photo === 'string' && member.membership.photo.trim() !== ''
      ? member.membership.photo
      : undefined;
  const animatedPhoto =
    typeof member.membership?.animation === 'string' && member.membership.animation.trim() !== ''
      ? member.membership.animation
      : undefined;

  const displayImage = isHovered && animatedPhoto ? animatedPhoto : staticPhoto;
  const divisionName = member.membership?.core_team_division?.name ?? 'Core Team';

  useEffect(() => {
    const chipEl = chipRef.current;
    if (!chipEl) return;

    const fitText = () => {
      const labelEl = chipEl.querySelector<HTMLElement>('.MuiChip-label');
      if (!labelEl) return;

      labelEl.style.removeProperty('font-size');
      if (labelEl.scrollWidth > labelEl.clientWidth && labelEl.scrollWidth > 0) {
        const computed = window.getComputedStyle(labelEl);
        const currentSize = parseFloat(computed.fontSize);
        const paddingX =
          (parseFloat(computed.paddingLeft) || 0) + (parseFloat(computed.paddingRight) || 0);
        const textWidth = Math.max(1, labelEl.scrollWidth - paddingX);
        const availableTextWidth = Math.max(1, labelEl.clientWidth - paddingX - 2);
        const ratio = availableTextWidth / textWidth;
        const nextSize = Math.max(8, Math.floor(currentSize * ratio * 10) / 10);
        labelEl.style.setProperty('font-size', `${nextSize}px`, 'important');
      }
    };

    fitText();

    const parentEl = chipEl.parentElement;
    if (!parentEl || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => fitText());
    observer.observe(parentEl);
    return () => observer.disconnect();
  }, [divisionName]);

  return (
    <Card
      elevation={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex h-full w-full flex-col overflow-hidden rounded-3xl bg-(--m3-palette-surfaceContainerHigh-main) p-0 shadow-none transition-colors duration-300 hover:bg-(--m3-palette-surfaceContainerHighest-main)"
    >
      <Box className="relative aspect-square w-full shrink-0 overflow-hidden rounded-3xl bg-(--m3-palette-surfaceContainerHighest-main)">
        {displayImage ? (
          <CardMedia
            component="img"
            image={displayImage}
            alt={member.name}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <Stack className="h-full w-full items-center justify-center text-(--m3-palette-onSurfaceVariant-main)">
            <PersonOutlineRounded sx={{ fontSize: 64 }} />
          </Stack>
        )}
      </Box>

      <Stack className="flex-1 items-center justify-between gap-2.5 px-2.5 py-4 text-center">
        <Box className="flex flex-1 items-center justify-center px-1.5">
          <Typography
            component={NextLink}
            href={`/members/${encodeURIComponent(member.username)}`}
            variant="subtitle1"
            className="text-base leading-snug font-bold tracking-tight text-balance text-(--m3-palette-onSurface-main) no-underline transition-colors hover:text-(--m3-palette-primary-main)"
          >
            {member.name}
          </Typography>
        </Box>

        <Chip
          ref={chipRef}
          label={divisionName}
          size="small"
          color="primary"
          className={`h-7 max-w-full rounded-full bg-(--m3-palette-primaryContainer-main) font-semibold text-(--m3-palette-onPrimaryContainer-main) [&_.MuiChip-label]:px-2.5 [&_.MuiChip-label]:text-clip ${getChipTextSizeClass(
            divisionName,
          )}`}
        />
      </Stack>
    </Card>
  );
}
