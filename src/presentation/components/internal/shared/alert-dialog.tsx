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
  title: string;
  description?: string;
  acceptText?: string;
  cancelText?: string;
};

export function AlertDialog({
  open,
  onAccept,
  onCancel,
  title,
  description,
  acceptText,
  cancelText,
}: Props) {
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      role="alertdialog"
      slotProps={{
        paper: {
          className: 'rounded-2xl',
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
        <Button onClick={onCancel} autoFocus>
          {cancelText || 'Cancel'}
        </Button>
        <Button onClick={onAccept} variant="tonal" color="primary">
          {acceptText || 'Accept'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
