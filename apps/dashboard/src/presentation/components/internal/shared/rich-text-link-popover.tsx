'use client';

import { Box, Button, Popover, TextField } from '@mui/material';

type Props = {
  anchorEl: HTMLElement | null;
  url: string;
  isLinkActive: boolean;
  onUrlChange: (url: string) => void;
  onApply: () => void;
  onRemove: () => void;
  onClose: () => void;
};

export function RichTextLinkPopover({
  anchorEl,
  url,
  isLinkActive,
  onUrlChange,
  onApply,
  onRemove,
  onClose,
}: Props) {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{
        paper: {
          sx: {
            p: 2,
            mt: 0.5,
            width: 320,
            borderRadius: 2,
          },
        },
      }}
    >
      <Box className="flex flex-col gap-2.5">
        <TextField
          size="small"
          label="Link URL"
          placeholder="https://example.com"
          value={url}
          autoFocus
          fullWidth
          onChange={(event) => onUrlChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onApply();
            }
          }}
        />
        <Box className="flex justify-end gap-1.5">
          {isLinkActive ? (
            <Button size="small" color="error" onClick={onRemove}>
              Remove
            </Button>
          ) : null}
          <Button size="small" onClick={onClose}>
            Cancel
          </Button>
          <Button size="small" variant="filled" onClick={onApply}>
            Apply
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}
