'use client';

import NextLink from 'next/link';
import { ArrowForwardRounded } from '@mui/icons-material';
import { Box, Button, Chip, Container, Stack, Typography } from '@mui/material';
import { CoreTeam } from '@infiniteuny/infinity-domain';
import { CoreTeamMemberCard } from '@app/presentation/components/core-teams';
import { CoreTeamMemberDto } from '@infiniteuny/infinity-infrastructure';
import {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

type Props = {
  coreTeam?: CoreTeam;
  members: CoreTeamMemberDto[];
};

const DRAG_THRESHOLD_PX = 5;

function normalizeOffset(value: number, period: number): number {
  if (period <= 0) return 0;
  return ((value % period) + period) % period;
}

export function OrganizationSection({ coreTeam, members }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const repeatCount = members.length > 0 ? Math.max(4, Math.ceil(16 / members.length)) : 0;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || members.length === 0 || repeatCount === 0) return;

    let animationFrameId: number;
    let lastTimestamp: number | null = null;
    const speedPxPerSecond = 55;

    const step = (timestamp: number) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }
      const deltaSeconds = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (!isHoveredRef.current && !isDraggingRef.current) {
        const singleSetWidth = track.scrollWidth / repeatCount;
        if (singleSetWidth > 0) {
          offsetRef.current = normalizeOffset(
            offsetRef.current + speedPxPerSecond * deltaSeconds,
            singleSetWidth,
          );
          track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
        }
      }

      animationFrameId = window.requestAnimationFrame(step);
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [members.length, repeatCount]);

  useEffect(() => {
    const handleWindowPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const track = trackRef.current;
      if (!track || repeatCount === 0) return;

      const deltaX = e.clientX - dragStartXRef.current;
      if (!hasDraggedRef.current && Math.abs(deltaX) > DRAG_THRESHOLD_PX) {
        hasDraggedRef.current = true;
        setIsDragging(true);
      }

      const singleSetWidth = track.scrollWidth / repeatCount;
      if (singleSetWidth > 0) {
        offsetRef.current = normalizeOffset(dragStartOffsetRef.current - deltaX, singleSetWidth);
        track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
      }
    };

    const handleWindowPointerUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
    window.addEventListener('pointercancel', handleWindowPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('pointercancel', handleWindowPointerUp);
    };
  }, [repeatCount]);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
  };

  const handleClickCapture = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      hasDraggedRef.current = false;
    }
  };

  if (members.length === 0) return null;

  const carouselMembers = Array.from({ length: repeatCount }, () => members).flat();

  return (
    <Box
      id="organization"
      component="section"
      className="w-full overflow-hidden bg-(--m3-palette-surfaceContainerLowest-main) py-20"
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          className="mb-12 items-start justify-between gap-4 sm:items-end"
        >
          <Box>
            <Chip label="Organisasi" color="primary" size="small" className="mb-3 font-semibold" />
            <Typography variant="h3" component="h2" className="text-3xl font-extrabold">
              {coreTeam ? `Core Team ${coreTeam.year}` : 'Core Team'}
            </Typography>
          </Box>
          <Button
            component={NextLink}
            href="/core-teams"
            variant="tonal"
            endIcon={<ArrowForwardRounded />}
          >
            Lihat Semua
          </Button>
        </Stack>
      </Container>

      <Box
        className={`relative w-full touch-pan-y overflow-hidden select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
        onPointerDown={handlePointerDown}
        onClickCapture={handleClickCapture}
        onDragStart={(e) => e.preventDefault()}
      >
        <Box className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-(--m3-palette-surfaceContainerLowest-main) to-transparent sm:w-28 md:w-44" />
        <Box className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-(--m3-palette-surfaceContainerLowest-main) to-transparent sm:w-28 md:w-44" />

        <Box ref={trackRef} className="flex w-max items-stretch py-2 will-change-transform">
          {carouselMembers.map((member, index) => (
            <Box key={`${member.id}-${index}`} className="flex w-68 shrink-0 pr-6 sm:w-76">
              <CoreTeamMemberCard member={member} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
