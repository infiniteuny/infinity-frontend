import { Theme } from '@mui/material';

export function getRichTextContentSx(theme: Theme) {
  return {
    color: theme.vars?.palette.onSurface.main,
    lineHeight: 1.65,
    wordBreak: 'break-word',
    '& .tiptap': {
      outline: 'none',
      minHeight: 'inherit',
    },
    '& .tiptap p.is-editor-empty:first-of-type::before': {
      content: 'attr(data-placeholder)',
      float: 'left',
      height: 0,
      pointerEvents: 'none',
      color: theme.vars?.palette.onSurfaceVariant.main,
      opacity: 0.7,
    },
    '& p': {
      m: 0,
      mb: 1,
      '&:last-child': {
        mb: 0,
      },
    },
    '& h1': {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      mt: 2,
      mb: 1,
      '&:first-of-type': {
        mt: 0,
      },
    },
    '& h2': {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.35,
      mt: 1.75,
      mb: 0.75,
      '&:first-of-type': {
        mt: 0,
      },
    },
    '& h3': {
      fontSize: '1.1rem',
      fontWeight: 600,
      lineHeight: 1.4,
      mt: 1.5,
      mb: 0.5,
      '&:first-of-type': {
        mt: 0,
      },
    },
    '& ul': {
      listStyleType: 'disc',
      pl: 3,
      my: 1,
    },
    '& ol': {
      listStyleType: 'decimal',
      pl: 3,
      my: 1,
    },
    '& li': {
      my: 0.25,
      '& > p': {
        mb: 0.25,
      },
    },
    '& blockquote': {
      borderLeft: '3px solid',
      borderColor: theme.vars?.palette.outlineVariant,
      pl: 2,
      ml: 0,
      mr: 0,
      my: 1.5,
      color: theme.vars?.palette.onSurfaceVariant.main,
      fontStyle: 'italic',
    },
    '& code': {
      bgcolor: theme.vars?.palette.surfaceContainerHighest.main,
      px: 0.75,
      py: 0.25,
      borderRadius: 0.75,
      fontFamily: 'var(--font-source-code-pro), monospace',
      fontSize: '0.875em',
    },
    '& pre': {
      bgcolor: theme.vars?.palette.surfaceContainerHighest.main,
      p: 1.5,
      borderRadius: 1.5,
      overflowX: 'auto',
      my: 1.5,
      '& code': {
        bgcolor: 'transparent',
        p: 0,
        borderRadius: 0,
        fontSize: '0.875rem',
      },
    },
    '& a': {
      color: theme.vars?.palette.primary.main,
      textDecoration: 'underline',
      textUnderlineOffset: '2px',
    },
    '& hr': {
      border: 0,
      borderTop: '1px solid',
      borderColor: theme.vars?.palette.outlineVariant,
      my: 2,
    },
  };
}
