'use client';

import { Box, Container, Typography } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle: ReactNode;
  icon?: ReactNode;
  position?: 'top' | 'middle' | 'bottom' | 'single';
  suppressSubtitleHydrationWarning?: boolean;
};

export function ViewTile({
  title,
  subtitle,
  icon,
  position = 'single',
  suppressSubtitleHydrationWarning,
}: Props) {
  let roundedClass;
  switch (position) {
    case 'top':
      roundedClass = 'rounded-t-2xl rounded-b-md';
      break;
    case 'middle':
      roundedClass = 'rounded-md';
      break;
    case 'bottom':
      roundedClass = 'rounded-t-md rounded-b-2xl';
      break;
    case 'single':
    default:
      roundedClass = 'rounded-2xl';
      break;
  }

  const isPrimitiveSubtitle = typeof subtitle === 'string' || typeof subtitle === 'number';

  return (
    <Container
      maxWidth={false}
      sx={{ bgcolor: 'surfaceContainerHigh.main' }}
      className={`flex w-full justify-start p-4 text-left select-text ${roundedClass}`}
    >
      {icon ? <Box className="flex w-10 items-center justify-center pr-4">{icon}</Box> : null}
      <Box className="min-w-0 flex-1">
        <Typography variant="body1" component="p" className="font-medium">
          {title}
        </Typography>
        {isPrimitiveSubtitle ? (
          <Typography
            variant="body2"
            component="p"
            suppressHydrationWarning={suppressSubtitleHydrationWarning}
          >
            {subtitle}
          </Typography>
        ) : (
          <Box className="mt-0.5">{subtitle}</Box>
        )}
      </Box>
    </Container>
  );
}
