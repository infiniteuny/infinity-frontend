'use client';

import { Chip } from '@mui/material';

type Props = {
  status: string;
};

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  ACCEPTED: {
    label: 'Accepted',
    className:
      'bg-(--m3-palette-primaryContainer-main) text-(--m3-palette-onPrimaryContainer-main)',
  },
  PENDING: {
    label: 'Pending',
    className:
      'bg-(--m3-palette-tertiaryContainer-main) text-(--m3-palette-onTertiaryContainer-main)',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-(--m3-palette-errorContainer-main) text-(--m3-palette-onErrorContainer-main)',
  },
};

export function StatusChip({ status }: Props) {
  const normalized = status.toUpperCase();
  const config = STATUS_STYLES[normalized] ?? {
    label: status,
    className:
      'bg-(--m3-palette-surfaceContainerHighest-main) text-(--m3-palette-onSurfaceVariant-main)',
  };

  return (
    <Chip
      label={config.label}
      size="small"
      className={`h-6 text-xs font-semibold ${config.className}`}
    />
  );
}
