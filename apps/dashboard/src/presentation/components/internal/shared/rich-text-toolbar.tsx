'use client';

import { Box, Divider, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import {
  CodeRounded,
  DataObjectRounded,
  FormatAlignCenterRounded,
  FormatAlignJustifyRounded,
  FormatAlignLeftRounded,
  FormatAlignRightRounded,
  FormatBoldRounded,
  FormatClearRounded,
  FormatItalicRounded,
  FormatListBulletedRounded,
  FormatListNumberedRounded,
  FormatQuoteRounded,
  FormatUnderlinedRounded,
  HorizontalRuleRounded,
  LinkOffRounded,
  LinkRounded,
  RedoRounded,
  StrikethroughSRounded,
  UndoRounded,
} from '@mui/icons-material';
import { Editor, useEditorState } from '@tiptap/react';
import { MouseEvent, useState } from 'react';
import { normalizeLinkUrl } from '@infiniteuny/infinity-utils';
import { RichTextLinkPopover } from './rich-text-link-popover';
import { RichTextToolbarButton } from './rich-text-toolbar-button';

type BlockLevel = 'paragraph' | 'h1' | 'h2' | 'h3';

type Props = {
  editor: Editor | null;
  disabled: boolean;
  onOverlayOpenChange?: (open: boolean) => void;
};

export function RichTextToolbar({ editor, disabled, onOverlayOpenChange }: Props) {
  const [isBlockMenuOpen, setIsBlockMenuOpen] = useState(false);
  const [linkAnchorEl, setLinkAnchorEl] = useState<HTMLElement | null>(null);
  const [linkUrl, setLinkUrl] = useState('');

  const editorState = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => {
      if (!currentEditor) {
        return null;
      }

      let blockLevel: BlockLevel = 'paragraph';
      if (currentEditor.isActive('heading', { level: 1 })) {
        blockLevel = 'h1';
      } else if (currentEditor.isActive('heading', { level: 2 })) {
        blockLevel = 'h2';
      } else if (currentEditor.isActive('heading', { level: 3 })) {
        blockLevel = 'h3';
      }

      return {
        blockLevel,
        isBold: currentEditor.isActive('bold'),
        isItalic: currentEditor.isActive('italic'),
        isUnderline: currentEditor.isActive('underline'),
        isStrike: currentEditor.isActive('strike'),
        isCode: currentEditor.isActive('code'),
        isAlignLeft: currentEditor.isActive({ textAlign: 'left' }),
        isAlignCenter: currentEditor.isActive({ textAlign: 'center' }),
        isAlignRight: currentEditor.isActive({ textAlign: 'right' }),
        isAlignJustify: currentEditor.isActive({ textAlign: 'justify' }),
        isBulletList: currentEditor.isActive('bulletList'),
        isOrderedList: currentEditor.isActive('orderedList'),
        isBlockquote: currentEditor.isActive('blockquote'),
        isCodeBlock: currentEditor.isActive('codeBlock'),
        isLink: currentEditor.isActive('link'),
        canUndo: currentEditor.can().chain().focus().undo().run(),
        canRedo: currentEditor.can().chain().focus().redo().run(),
      };
    },
  });

  const controlsDisabled = disabled || !editor;

  const handleBlockChange = (event: SelectChangeEvent<BlockLevel>) => {
    if (!editor) return;

    switch (event.target.value as BlockLevel) {
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'h3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'paragraph':
      default:
        editor.chain().focus().setParagraph().run();
        break;
    }
  };

  const handleOpenLinkPopover = (event: MouseEvent<HTMLButtonElement>) => {
    if (!editor) return;
    const currentHref = (editor.getAttributes('link').href as string | undefined) ?? '';
    setLinkUrl(currentHref);
    setLinkAnchorEl(event.currentTarget);
    onOverlayOpenChange?.(true);
  };

  const handleCloseLinkPopover = () => {
    setLinkAnchorEl(null);
    onOverlayOpenChange?.(isBlockMenuOpen);
    editor?.commands.focus();
  };

  const handleApplyLink = () => {
    if (!editor) return;
    const normalized = normalizeLinkUrl(linkUrl);

    if (!normalized) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: normalized }).run();
    }

    setLinkAnchorEl(null);
    onOverlayOpenChange?.(isBlockMenuOpen);
  };

  const handleRemoveLink = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setLinkAnchorEl(null);
    onOverlayOpenChange?.(isBlockMenuOpen);
  };

  return (
    <>
      <Box
        sx={(theme) => ({
          bgcolor: theme.vars?.palette.surfaceContainerLow.main,
          borderBottom: '1px solid',
          borderColor: theme.vars?.palette.outlineVariant,
        })}
        className="flex flex-wrap items-center gap-0.5 px-2 py-1.5"
      >
        <Select<BlockLevel>
          size="small"
          value={editorState?.blockLevel ?? 'paragraph'}
          disabled={controlsDisabled}
          onOpen={() => {
            setIsBlockMenuOpen(true);
            onOverlayOpenChange?.(true);
          }}
          onClose={() => {
            setIsBlockMenuOpen(false);
            onOverlayOpenChange?.(Boolean(linkAnchorEl));
          }}
          onChange={handleBlockChange}
          inputProps={{ 'aria-label': 'Text style' }}
          sx={{
            height: 32,
            minWidth: 124,
            mr: 0.5,
            fontSize: '0.8125rem',
            '& .MuiSelect-select': {
              py: 0.5,
              px: 1.25,
            },
          }}
        >
          <MenuItem value="paragraph">Normal</MenuItem>
          <MenuItem value="h1">Heading 1</MenuItem>
          <MenuItem value="h2">Heading 2</MenuItem>
          <MenuItem value="h3">Heading 3</MenuItem>
        </Select>

        <Divider orientation="vertical" flexItem className="mx-0.5 my-1" />

        <RichTextToolbarButton
          label="Bold"
          active={Boolean(editorState?.isBold)}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <FormatBoldRounded fontSize="small" />
        </RichTextToolbarButton>
        <RichTextToolbarButton
          label="Italic"
          active={Boolean(editorState?.isItalic)}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <FormatItalicRounded fontSize="small" />
        </RichTextToolbarButton>
        <RichTextToolbarButton
          label="Underline"
          active={Boolean(editorState?.isUnderline)}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          <FormatUnderlinedRounded fontSize="small" />
        </RichTextToolbarButton>
        <RichTextToolbarButton
          label="Strikethrough"
          active={Boolean(editorState?.isStrike)}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          <StrikethroughSRounded fontSize="small" />
        </RichTextToolbarButton>
        <RichTextToolbarButton
          label="Inline code"
          active={Boolean(editorState?.isCode)}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleCode().run()}
        >
          <CodeRounded fontSize="small" />
        </RichTextToolbarButton>

        <Divider orientation="vertical" flexItem className="mx-0.5 my-1" />

        <RichTextToolbarButton
          label="Align left"
          active={Boolean(editorState?.isAlignLeft)}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleTextAlign('left').run()}
        >
          <FormatAlignLeftRounded fontSize="small" />
        </RichTextToolbarButton>
        <RichTextToolbarButton
          label="Align center"
          active={Boolean(editorState?.isAlignCenter)}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleTextAlign('center').run()}
        >
          <FormatAlignCenterRounded fontSize="small" />
        </RichTextToolbarButton>
        <RichTextToolbarButton
          label="Align right"
          active={Boolean(editorState?.isAlignRight)}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleTextAlign('right').run()}
        >
          <FormatAlignRightRounded fontSize="small" />
        </RichTextToolbarButton>
        <RichTextToolbarButton
          label="Justify"
          active={Boolean(editorState?.isAlignJustify)}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleTextAlign('justify').run()}
        >
          <FormatAlignJustifyRounded fontSize="small" />
        </RichTextToolbarButton>

        <Divider orientation="vertical" flexItem className="mx-0.5 my-1" />

        <RichTextToolbarButton
          label="Bullet list"
          active={Boolean(editorState?.isBulletList)}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <FormatListBulletedRounded fontSize="small" />
        </RichTextToolbarButton>
        <RichTextToolbarButton
          label="Numbered list"
          active={Boolean(editorState?.isOrderedList)}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <FormatListNumberedRounded fontSize="small" />
        </RichTextToolbarButton>
        <RichTextToolbarButton
          label="Blockquote"
          active={Boolean(editorState?.isBlockquote)}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <FormatQuoteRounded fontSize="small" />
        </RichTextToolbarButton>
        <RichTextToolbarButton
          label="Code block"
          active={Boolean(editorState?.isCodeBlock)}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        >
          <DataObjectRounded fontSize="small" />
        </RichTextToolbarButton>
        <RichTextToolbarButton
          label="Horizontal rule"
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        >
          <HorizontalRuleRounded fontSize="small" />
        </RichTextToolbarButton>

        <Divider orientation="vertical" flexItem className="mx-0.5 my-1" />

        <RichTextToolbarButton
          label={editorState?.isLink ? 'Edit link' : 'Insert link'}
          active={Boolean(editorState?.isLink)}
          disabled={controlsDisabled}
          onClick={handleOpenLinkPopover}
        >
          <LinkRounded fontSize="small" />
        </RichTextToolbarButton>
        {editorState?.isLink ? (
          <RichTextToolbarButton
            label="Remove link"
            disabled={controlsDisabled}
            onClick={handleRemoveLink}
          >
            <LinkOffRounded fontSize="small" />
          </RichTextToolbarButton>
        ) : null}
        <RichTextToolbarButton
          label="Clear formatting"
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          <FormatClearRounded fontSize="small" />
        </RichTextToolbarButton>

        <Divider orientation="vertical" flexItem className="mx-0.5 my-1" />

        <RichTextToolbarButton
          label="Undo"
          disabled={controlsDisabled || !editorState?.canUndo}
          onClick={() => editor?.chain().focus().undo().run()}
        >
          <UndoRounded fontSize="small" />
        </RichTextToolbarButton>
        <RichTextToolbarButton
          label="Redo"
          disabled={controlsDisabled || !editorState?.canRedo}
          onClick={() => editor?.chain().focus().redo().run()}
        >
          <RedoRounded fontSize="small" />
        </RichTextToolbarButton>
      </Box>

      <RichTextLinkPopover
        anchorEl={linkAnchorEl}
        url={linkUrl}
        isLinkActive={Boolean(editorState?.isLink)}
        onUrlChange={setLinkUrl}
        onApply={handleApplyLink}
        onRemove={handleRemoveLink}
        onClose={handleCloseLinkPopover}
      />
    </>
  );
}
