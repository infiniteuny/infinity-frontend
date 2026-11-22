'use client';

import { IconButton, Tooltip } from '@mui/material';
import { MouseEvent, ReactNode } from 'react';

type Props = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
};

export function RichTextToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: Props) {
  return (
    <Tooltip title={label}>
      <span>
        <IconButton
          size="small"
          aria-label={label}
          aria-pressed={active}
          disabled={disabled}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={onClick}
          sx={(theme) => ({
            borderRadius: 1.5,
            p: 0.75,
            bgcolor: active ? theme.vars?.palette.secondaryContainer.main : 'transparent',
            color: active
              ? theme.vars?.palette.onSecondaryContainer.main
              : theme.vars?.palette.onSurfaceVariant.main,
            '&:hover': {
              bgcolor: active
                ? theme.vars?.palette.secondaryContainer.main
                : theme.vars?.palette.surfaceContainerHighest.main,
            },
          })}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
}
