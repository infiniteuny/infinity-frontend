'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

type Props = {
  open: boolean;
  onAccept: () => void;
  onCancel: () => void;
  onExited?: () => void;
  isLoading?: boolean;
  confirmColor?: 'primary' | 'error';
  title: string;
  description?: string;
  acceptText?: string;
  cancelText?: string;
};

export function AlertDialog({
  open,
  onAccept,
  onCancel,
  onExited,
  isLoading = false,
  confirmColor = 'primary',
  title,
  description,
  acceptText,
  cancelText,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isLoading) {
          onCancel();
        }
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      role="alertdialog"
      slotProps={{
        paper: {
          className: 'rounded-2xl',
        },
        transition: {
          onExited,
        },
      }}
    >
      <DialogTitle id="alert-dialog-title" className="pt-6">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
      </DialogContent>
      <DialogActions className="px-6 pb-5">
        <Button onClick={onCancel} disabled={isLoading} autoFocus>
          {cancelText || 'Cancel'}
        </Button>
        <Button
          onClick={onAccept}
          disabled={isLoading}
          variant="tonal"
          color={confirmColor}
          sx={
            confirmColor === 'error'
              ? (theme) => ({
                  bgcolor: theme.vars?.palette.errorContainer.main,
                  color: theme.vars?.palette.onErrorContainer.main,
                  '&:hover': {
                    bgcolor: theme.vars?.palette.errorContainer.main,
                  },
                })
              : undefined
          }
        >
          {acceptText || 'Accept'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
