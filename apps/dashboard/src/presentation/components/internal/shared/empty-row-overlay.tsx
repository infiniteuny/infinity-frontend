'use client';

import { GridOverlay } from '@mui/x-data-grid';
import { Typography } from '@mui/material';

type Props = {
  text?: string;
};

export function EmptyRowOverlay({ text }: Props) {
  return (
    <GridOverlay className="flex-col py-2 text-center">
      <Typography component="p">{text ?? 'No data.'}</Typography>
    </GridOverlay>
  );
}
