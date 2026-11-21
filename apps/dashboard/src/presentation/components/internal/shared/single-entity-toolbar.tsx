'use client';

import Link from 'next/link';
import { AlertDialog } from './alert-dialog';
import { Box, Button } from '@mui/material';
import { DeleteRounded, EditRounded, SaveRounded } from '@mui/icons-material';
import { Either, match } from 'effect/Either';
import { RefObject, useState } from 'react';
import { useRouter } from 'next/navigation';

type ViewModeProps = {
  mode: 'view';
  canEdit: boolean;
  editHref: string;
  editAriaLabel: string;
  editLabel?: string;
  canDelete?: boolean;
  deleteAriaLabel?: string;
  deleteLabel?: string;
  deleteConfirmDescription?: string;
  onDelete?: () => Promise<Either<unknown, Error>>;
  deleteRedirectHref?: string;
};

type FormModeProps = {
  mode: 'form';
  formRef: RefObject<HTMLFormElement | null>;
  isDirty: boolean;
  isSubmitting: boolean;
  saveAriaLabel: string;
  saveLabel?: string;
};

type Props = ViewModeProps | FormModeProps;

export function SingleEntityToolbar(props: Props) {
  const router = useRouter();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDiscardDialog, setOpenDiscardDialog] = useState(false);

  const handleDeleteAccept = async () => {
    if (props.mode !== 'view' || !props.onDelete || isDeleting) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await props.onDelete();
      match(result, {
        onRight: () => {
          setOpenDeleteDialog(false);
          if (props.deleteRedirectHref) {
            router.push(props.deleteRedirectHref);
          }
          router.refresh();
        },
        onLeft: (error) => {
          console.error('Failed to delete item:', error);
          setOpenDeleteDialog(false);
        },
      });
    } catch (error) {
      console.error('Failed to delete item:', error);
      setOpenDeleteDialog(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (props.mode === 'view') {
    return (
      <>
        {props.canDelete && props.onDelete ? (
          <AlertDialog
            open={openDeleteDialog}
            onAccept={handleDeleteAccept}
            onCancel={() => {
              if (!isDeleting) {
                setOpenDeleteDialog(false);
              }
            }}
            isLoading={isDeleting}
            confirmColor="error"
            title="Permanently delete?"
            description={
              props.deleteConfirmDescription ??
              'Are you sure you want to permanently delete this item? This action cannot be undone.'
            }
            acceptText="Delete"
            cancelText="Cancel"
          />
        ) : null}
        <Box className="ml-auto flex flex-wrap-reverse justify-end gap-y-2">
          {props.canDelete && props.onDelete ? (
            <Button
              variant="outlined"
              color="error"
              className="ml-4"
              aria-label={props.deleteAriaLabel ?? 'Delete'}
              startIcon={<DeleteRounded />}
              disabled={isDeleting}
              onClick={() => setOpenDeleteDialog(true)}
            >
              {props.deleteLabel ?? 'Delete'}
            </Button>
          ) : null}
          {props.canEdit ? (
            <Button
              variant="filled"
              className="ml-4"
              aria-label={props.editAriaLabel}
              LinkComponent={Link}
              href={props.editHref}
              startIcon={<EditRounded />}
            >
              {props.editLabel ?? 'Edit'}
            </Button>
          ) : null}
        </Box>
      </>
    );
  }

  return (
    <>
      <AlertDialog
        open={openDiscardDialog}
        onAccept={() => {
          setOpenDiscardDialog(false);
          router.back();
        }}
        onCancel={() => setOpenDiscardDialog(false)}
        confirmColor="error"
        title="Discard changes?"
        description="You have unsaved changes. Are you sure you want to leave without saving?"
        acceptText="Discard"
        cancelText="Keep editing"
      />
      <Box className="ml-auto flex flex-wrap-reverse justify-end gap-y-2">
        <Button
          variant="text"
          className="ml-4"
          aria-label="Cancel"
          disabled={props.isSubmitting}
          onClick={() => {
            if (props.isDirty) {
              setOpenDiscardDialog(true);
            } else {
              router.back();
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="filled"
          className="ml-4"
          aria-label={props.saveAriaLabel}
          startIcon={<SaveRounded />}
          disabled={!props.isDirty || props.isSubmitting}
          onClick={() => props.formRef.current?.requestSubmit()}
        >
          {props.saveLabel ?? 'Save'}
        </Button>
      </Box>
    </>
  );
}
