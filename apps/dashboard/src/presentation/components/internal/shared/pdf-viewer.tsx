'use client';

import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Toolbar,
  Typography,
} from '@mui/material';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  FullscreenRounded,
  RestartAltRounded,
  ZoomInRounded,
  ZoomOutRounded,
} from '@mui/icons-material';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Props = {
  file: string | File;
  title?: string;
  height?: number;
  className?: string;
};

export function PdfViewer({ file, title = 'PDF Document', height = 720, className }: Props) {
  const viewerRootRef = useRef<HTMLDivElement | null>(null);
  const pagesContainerRef = useRef<HTMLDivElement | null>(null);
  const pageWrappersRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const pageVisibilityRef = useRef<Map<number, number>>(new Map());
  const resizeRafRef = useRef<number | null>(null);
  const fullscreenTransitionTimeoutRef = useRef<number | null>(null);
  const isFullscreenTransitioningRef = useRef(false);

  const [numPages, setNumPages] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [zoomScale, setZoomScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState(720);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFullscreenTransitioning, setIsFullscreenTransitioning] = useState(false);
  const tooltipSlotProps = { popper: { disablePortal: true } };

  const pageWidth = useMemo(() => {
    if (!containerWidth) {
      return 640;
    }

    return Math.max(320, Math.floor(containerWidth - 24));
  }, [containerWidth]);

  const isPageOverflowingHorizontally = useMemo(() => {
    return pageWidth * zoomScale > containerWidth;
  }, [containerWidth, pageWidth, zoomScale]);

  const onLoadSuccess = ({ numPages }: PDFDocumentProxy) => {
    setNumPages(numPages);
    setActivePage(1);
    pageVisibilityRef.current.clear();
    setErrorMessage(null);
  };

  const onLoadError = (error: Error) => {
    setErrorMessage(error.message || 'Failed to load PDF document.');
  };

  const handleFullscreen = async () => {
    const root = viewerRootRef.current;
    if (!root || !document.fullscreenEnabled) {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await root.requestFullscreen();
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreenTransitioning(true);

    if (fullscreenTransitionTimeoutRef.current !== null) {
      window.clearTimeout(fullscreenTransitionTimeoutRef.current);
    }

    fullscreenTransitionTimeoutRef.current = window.setTimeout(() => {
      setIsFullscreenTransitioning(false);

      const element = pagesContainerRef.current;
      if (element) {
        const nextWidth = element.clientWidth;
        setContainerWidth((prevWidth) => (prevWidth === nextWidth ? prevWidth : nextWidth));
      }

      fullscreenTransitionTimeoutRef.current = null;
    }, 220);
  };

  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(2.5, Number((prev + 0.1).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => Math.max(0.5, Number((prev - 0.1).toFixed(2))));
  };

  const handleZoomReset = () => {
    setZoomScale(1);
  };

  useEffect(() => {
    isFullscreenTransitioningRef.current = isFullscreenTransitioning;
  }, [isFullscreenTransitioning]);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      if (fullscreenTransitionTimeoutRef.current !== null) {
        window.clearTimeout(fullscreenTransitionTimeoutRef.current);
        fullscreenTransitionTimeoutRef.current = null;
      }

      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const element = pagesContainerRef.current;
    if (!element) {
      return;
    }

    const updateWidth = () => {
      if (isFullscreenTransitioningRef.current) {
        return;
      }

      const nextWidth = element.clientWidth;
      setContainerWidth((prevWidth) => (prevWidth === nextWidth ? prevWidth : nextWidth));
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      if (resizeRafRef.current !== null) {
        cancelAnimationFrame(resizeRafRef.current);
      }

      resizeRafRef.current = requestAnimationFrame(updateWidth);
    });
    resizeObserver.observe(element);

    return () => {
      if (resizeRafRef.current !== null) {
        cancelAnimationFrame(resizeRafRef.current);
        resizeRafRef.current = null;
      }

      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const container = pagesContainerRef.current;
    if (!container || !numPages) {
      return;
    }

    pageVisibilityRef.current.clear();

    const observer = new IntersectionObserver(
      (entries) => {
        if (isFullscreenTransitioningRef.current) {
          return;
        }

        entries.forEach((entry) => {
          const page = Number(entry.target.getAttribute('data-page-number'));
          if (Number.isNaN(page)) {
            return;
          }

          pageVisibilityRef.current.set(page, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let nextActivePage = 1;
        let highestRatio = -1;

        for (let page = 1; page <= numPages; page += 1) {
          const ratio = pageVisibilityRef.current.get(page) ?? 0;
          if (ratio > highestRatio) {
            highestRatio = ratio;
            nextActivePage = page;
          }
        }

        if (highestRatio > 0) {
          setActivePage((prevPage) => (prevPage === nextActivePage ? prevPage : nextActivePage));
        }
      },
      {
        root: container,
        threshold: [0.25, 0.5, 0.75],
      },
    );

    pageWrappersRef.current.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [numPages, file]);

  return (
    <Paper
      ref={viewerRootRef}
      variant="outlined"
      className={`relative flex flex-col overflow-hidden rounded-lg border-0 ${className}`}
      sx={{
        height,
      }}
    >
      <Toolbar className="min-h-13 justify-between gap-1">
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }} className="min-w-0 pr-2">
          <Typography variant="subtitle2" component="h3" noWrap>
            {title}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <Tooltip title="Zoom out" slotProps={tooltipSlotProps}>
            <span>
              <IconButton size="small" onClick={handleZoomOut} disabled={zoomScale <= 0.5}>
                <ZoomOutRounded fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Typography variant="caption" color="text.secondary" className="min-w-12 text-center">
            {Math.round(zoomScale * 100)}%
          </Typography>
          <Tooltip title="Zoom in" slotProps={tooltipSlotProps}>
            <span>
              <IconButton size="small" onClick={handleZoomIn} disabled={zoomScale >= 2.5}>
                <ZoomInRounded fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Reset zoom" slotProps={tooltipSlotProps}>
            <span>
              <IconButton size="small" onClick={handleZoomReset} disabled={zoomScale === 1}>
                <RestartAltRounded fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Full screen" slotProps={tooltipSlotProps}>
            <IconButton size="small" onClick={handleFullscreen}>
              <FullscreenRounded fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
      <Box
        ref={pagesContainerRef}
        className="min-h-0 flex-1 overflow-x-auto overflow-y-auto pt-3 pb-10"
        sx={{
          bgcolor: 'surfaceContainer.main',
        }}
      >
        <Document
          file={file}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          loading={
            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} className="py-12">
              <CircularProgress size={24} />
            </Stack>
          }
          error={
            <Typography color="error" variant="body2" className="px-4 text-center">
              {errorMessage ?? 'Unable to render this PDF document.'}
            </Typography>
          }
        >
          <Stack spacing={1.5} className="pt-3">
            {Array.from({ length: numPages }, (_, index) => index + 1).map((pageNumber) => (
              <Box
                key={pageNumber}
                className="flex w-full"
                sx={{
                  justifyContent: isPageOverflowingHorizontally ? 'flex-start' : 'center',
                  bgcolor: 'surfaceContainer.main',
                }}
              >
                <Box
                  data-page-number={pageNumber}
                  ref={(element: HTMLDivElement | null) => {
                    if (element) {
                      pageWrappersRef.current.set(pageNumber, element);
                    } else {
                      pageWrappersRef.current.delete(pageNumber);
                    }
                  }}
                  className="shadow"
                >
                  <Page
                    pageNumber={pageNumber}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    width={pageWidth}
                    scale={zoomScale}
                  />
                </Box>
              </Box>
            ))}
          </Stack>
        </Document>
      </Box>
      <Box className="pointer-events-none absolute bottom-2.5 left-1/2 z-2 -translate-x-1/2">
        <Typography
          variant="caption"
          className="rounded-full px-2.5 py-1 whitespace-nowrap shadow"
          sx={{
            bgcolor: 'surfaceContainerHigh.main',
            color: 'onSurface.main',
          }}
        >
          {numPages ? `Page ${activePage} of ${numPages}` : 'Page - of -'}
        </Typography>
      </Box>
    </Paper>
  );
}
