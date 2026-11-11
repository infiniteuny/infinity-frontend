'use client';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { FormatQuoteRounded } from '@mui/icons-material';
import {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Testimonial } from '@infiniteuny/infinity-domain';

type Props = {
  testimonials: Testimonial[];
};

const DRAG_THRESHOLD_PX = 5;

function normalizeOffset(value: number, period: number): number {
  if (period <= 0) return 0;
  return ((value % period) + period) % period;
}

export function TestimonialsSection({ testimonials }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const repeatCount =
    testimonials.length > 0 ? Math.max(4, Math.ceil(16 / testimonials.length)) : 0;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || testimonials.length === 0 || repeatCount === 0) return;

    let animationFrameId: number;
    let lastTimestamp: number | null = null;
    const speedPxPerSecond = 50;

    const step = (timestamp: number) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }
      const deltaSeconds = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (!isHoveredRef.current && !isDraggingRef.current && !selectedTestimonial) {
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
  }, [testimonials.length, repeatCount, selectedTestimonial]);

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

  if (testimonials.length === 0) return null;

  const carouselTestimonials = Array.from({ length: repeatCount }, () => testimonials).flat();
  const selectedAvatarUrl =
    selectedTestimonial && typeof selectedTestimonial.photo === 'string'
      ? selectedTestimonial.photo
      : undefined;

  return (
    <Box
      id="testimonials"
      component="section"
      className="w-full overflow-hidden bg-(--m3-palette-surfaceContainerLow-main) py-20"
    >
      <Container maxWidth="lg">
        <Stack className="mx-auto mb-14 max-w-3xl items-center text-center">
          <Chip label="Kata Mereka" color="primary" size="small" className="mb-3 font-semibold" />
          <Typography
            variant="h3"
            component="h2"
            className="mb-4 text-3xl font-extrabold sm:text-4xl"
          >
            Cerita & Testimoni Anggota
          </Typography>
          <Typography
            variant="body1"
            className="text-base text-(--m3-palette-onSurfaceVariant-main)"
          >
            Pengalaman nyata dari para anggota dan alumni yang bertumbuh bersama INFINITE.
          </Typography>
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
        <Box className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-(--m3-palette-surfaceContainerLow-main) to-transparent sm:w-28 md:w-44" />
        <Box className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-(--m3-palette-surfaceContainerLow-main) to-transparent sm:w-28 md:w-44" />

        <Box ref={trackRef} className="flex w-max items-stretch py-2 will-change-transform">
          {carouselTestimonials.map((item, index) => {
            const avatarUrl = typeof item.photo === 'string' ? item.photo : undefined;

            return (
              <Box key={`${item.id}-${index}`} className="flex w-84 shrink-0 pr-6 sm:w-96">
                <Card
                  elevation={0}
                  className="flex h-full w-full flex-col justify-between rounded-3xl bg-(--m3-palette-surfaceContainerHigh-main) p-0 shadow-none transition-colors duration-300 hover:bg-(--m3-palette-surfaceContainerHighest-main)"
                >
                  <CardContent className="flex h-full flex-col justify-between p-6 sm:p-7">
                    <Box>
                      <FormatQuoteRounded
                        fontSize="large"
                        className="mb-2 text-(--m3-palette-primary-main) opacity-60"
                      />
                      <Typography
                        variant="body1"
                        className="line-clamp-4 leading-relaxed text-(--m3-palette-onSurface-main) italic"
                      >
                        &ldquo;{item.content}&rdquo;
                      </Typography>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => setSelectedTestimonial(item)}
                        className="mt-2 -ml-2 px-2 font-semibold text-(--m3-palette-primary-main)"
                      >
                        Baca selengkapnya
                      </Button>
                    </Box>

                    <Stack direction="row" spacing={1.75} className="mt-5 items-center">
                      <Avatar
                        src={avatarUrl || '/assets/images/avatar-placeholder.jpg'}
                        alt={item.name}
                        className="h-12 w-12 shrink-0 bg-(--m3-palette-primaryContainer-main) text-(--m3-palette-onPrimaryContainer-main)"
                      >
                        {item.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box className="min-w-0">
                        <Typography variant="subtitle1" className="truncate font-bold">
                          {item.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          className="line-clamp-1 text-(--m3-palette-onSurfaceVariant-main)"
                        >
                          {item.position}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Dialog
        open={Boolean(selectedTestimonial)}
        onClose={() => setSelectedTestimonial(null)}
        scroll="paper"
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            elevation: 0,
            className: 'rounded-3xl bg-(--m3-palette-surfaceContainerHigh-main) p-2',
          },
        }}
      >
        {selectedTestimonial && (
          <>
            <DialogTitle className="px-6 pt-5 pb-3">
              <Stack direction="row" spacing={2} className="min-w-0 items-center">
                <Avatar
                  src={selectedAvatarUrl || '/assets/images/avatar-placeholder.jpg'}
                  alt={selectedTestimonial.name}
                  className="h-12 w-12 shrink-0 bg-(--m3-palette-primaryContainer-main) text-(--m3-palette-onPrimaryContainer-main)"
                >
                  {selectedTestimonial.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box className="min-w-0">
                  <Typography variant="subtitle1" className="truncate font-bold">
                    {selectedTestimonial.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="block truncate text-(--m3-palette-onSurfaceVariant-main)"
                  >
                    {selectedTestimonial.position}
                  </Typography>
                </Box>
              </Stack>
            </DialogTitle>

            <DialogContent className="max-h-[60vh] overflow-y-auto px-6 py-4">
              <FormatQuoteRounded
                fontSize="large"
                className="mb-2 text-(--m3-palette-primary-main) opacity-60"
              />
              <Typography
                variant="body1"
                className="leading-relaxed whitespace-pre-line text-(--m3-palette-onSurface-main) italic"
              >
                &ldquo;{selectedTestimonial.content}&rdquo;
              </Typography>
            </DialogContent>

            <DialogActions className="px-6 pt-2 pb-4">
              <Button variant="tonal" onClick={() => setSelectedTestimonial(null)}>
                Tutup
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
