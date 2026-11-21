'use client';

import Link from 'next/link';
import { Box, Button } from '@mui/material';
import { EditRounded, SaveRounded } from '@mui/icons-material';
import { RefObject } from 'react';
import { useRouter } from 'next/navigation';

type ViewModeProps = {
  mode: 'view';
  canEdit: boolean;
  editHref: string;
  editAriaLabel: string;
  editLabel?: string;
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

  if (props.mode === 'view') {
    return (
      <Box className="ml-auto">
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
    );
  }

  return (
    <Box className="ml-auto flex flex-wrap-reverse justify-end gap-y-2">
      <Button
        variant="text"
        className="ml-4"
        aria-label="Cancel"
        disabled={props.isSubmitting}
        onClick={() => router.back()}
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
  );
}
