import Link from 'next/link';
import { AddRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

export function FundApplicationsToolbar() {
  return (
    <Box className="ml-auto">
      <Button
        variant="filled"
        className="ml-4"
        aria-label="Add fund application"
        LinkComponent={Link}
        href="/fund-applications/new"
        startIcon={<AddRounded />}
      >
        Add fund application
      </Button>
    </Box>
  );
}
