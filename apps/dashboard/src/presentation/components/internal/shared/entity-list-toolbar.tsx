'use client';

import Link from 'next/link';
import { AddRounded, SearchRounded } from '@mui/icons-material';
import { Box, Button, IconButton } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';

export type DataGridApiRef = ReturnType<typeof useGridApiRef>;

type Props = {
  dataGridApiRef: DataGridApiRef;
  canCreate: boolean;
  createHref: string;
  createAriaLabel: string;
  createLabel?: string;
};

export function EntityListToolbar({
  dataGridApiRef,
  canCreate,
  createHref,
  createAriaLabel,
  createLabel = 'Add',
}: Props) {
  return (
    <Box className="ml-auto">
      <IconButton
        className="ml-4"
        aria-label="Search"
        onClick={() => {
          dataGridApiRef.current?.showFilterPanel();
        }}
      >
        <SearchRounded />
      </IconButton>
      {canCreate ? (
        <Button
          variant="filled"
          className="ml-4"
          aria-label={createAriaLabel}
          LinkComponent={Link}
          href={createHref}
          startIcon={<AddRounded />}
        >
          {createLabel}
        </Button>
      ) : null}
    </Box>
  );
}
