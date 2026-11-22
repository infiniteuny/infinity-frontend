'use client';

import { Box, FormControl, FormHelperText, FormLabel } from '@mui/material';
import { createTiptapExtensions, getRichTextContentSx, serializeTiptapEditor } from '@app/utils';
import { EditorContent, useEditor } from '@tiptap/react';
import { parseTiptapContent } from '@infiniteuny/infinity-utils';
import { RefCallBack } from 'react-hook-form';
import { RichTextToolbar } from './rich-text-toolbar';
import { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  isSubmitting: boolean;
  hasError: boolean;
  errorMessage?: string;
  minHeight: number;
  onChange: (value: string) => void;
  onBlur: () => void;
  fieldRef: RefCallBack;
};

export function RichTextEditor({
  id,
  label,
  value,
  placeholder,
  isSubmitting,
  hasError,
  errorMessage,
  minHeight,
  onChange,
  onBlur,
  fieldRef,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const onChangeRef = useRef(onChange);
  const lastEmittedValueRef = useRef<string | null>(null);
  const lastSyncedValueRef = useRef<string>(value);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const extensions = useMemo(() => createTiptapExtensions(placeholder), [placeholder]);

  const editor = useEditor({
    immediatelyRender: false,
    editable: !isSubmitting,
    extensions,
    content: parseTiptapContent(value).doc,
    editorProps: {
      attributes: {
        id,
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-label': label,
        'aria-invalid': hasError ? 'true' : 'false',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      const nextValue = serializeTiptapEditor(currentEditor);
      lastEmittedValueRef.current = nextValue;
      lastSyncedValueRef.current = nextValue;
      onChangeRef.current(nextValue);
    },
  });

  useEffect(() => {
    fieldRef({
      focus: () => {
        editor?.commands.focus();
      },
    });

    return () => {
      fieldRef(null);
    };
  }, [editor, fieldRef]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!isSubmitting, false);
  }, [editor, isSubmitting]);

  useEffect(() => {
    if (!editor) return;

    const parsed = parseTiptapContent(value);

    if (parsed.kind === 'legacy-text') {
      editor.commands.setContent(parsed.doc, { emitUpdate: false });
      const encoded = serializeTiptapEditor(editor);
      lastEmittedValueRef.current = encoded;
      lastSyncedValueRef.current = encoded;
      onChangeRef.current(encoded);
      return;
    }

    if (value !== lastSyncedValueRef.current && value !== lastEmittedValueRef.current) {
      lastSyncedValueRef.current = value;
      editor.commands.setContent(parsed.doc, { emitUpdate: false });
    }
  }, [editor, value]);

  return (
    <FormControl fullWidth margin="none" disabled={isSubmitting} error={hasError}>
      <FormLabel
        component="label"
        htmlFor={id}
        error={hasError}
        focused={isFocused}
        onClick={() => {
          if (!isSubmitting) {
            editor?.commands.focus();
          }
        }}
        className="px-3 text-xs"
      >
        {label}
      </FormLabel>

      <Box
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null) && !isOverlayOpen) {
            setIsFocused(false);
            onBlur();
          }
        }}
        sx={(theme) => ({
          border: '1px solid',
          borderColor: hasError
            ? theme.vars?.palette.error.main
            : isFocused
              ? theme.vars?.palette.primary.main
              : theme.vars?.palette.outline,
          outline: isFocused
            ? `1px solid ${
                hasError ? theme.vars?.palette.error.main : theme.vars?.palette.primary.main
              }`
            : 'none',
          borderRadius: 1,
          opacity: isSubmitting ? 0.7 : 1,
          transition: theme.transitions.create(['border-color', 'outline-color']),
        })}
        className="mt-1.5 overflow-hidden"
      >
        <RichTextToolbar
          editor={editor}
          disabled={isSubmitting}
          onOverlayOpenChange={setIsOverlayOpen}
        />

        <Box
          onClick={(event) => {
            if (event.target === event.currentTarget && !isSubmitting) {
              editor?.commands.focus('end');
            }
          }}
          sx={[
            getRichTextContentSx,
            {
              minHeight,
              px: 1.75,
              py: 1.5,
              cursor: isSubmitting ? 'not-allowed' : 'text',
            },
          ]}
        >
          <EditorContent editor={editor} />
        </Box>
      </Box>

      <FormHelperText error={hasError}>{errorMessage}</FormHelperText>
    </FormControl>
  );
}
