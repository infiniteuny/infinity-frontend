import { Box, Typography } from '@mui/material';
import { getRichTextContentSx, renderTiptapReactElement } from '@app/utils';
import { parseTiptapContent } from '@infiniteuny/infinity-utils';

type Props = {
  value: string | null | undefined;
};

export function RichTextViewer({ value }: Props) {
  const parsed = parseTiptapContent(value);

  if (parsed.kind === 'empty') {
    return (
      <Typography variant="body2" component="p">
        N/A
      </Typography>
    );
  }

  const rendered = renderTiptapReactElement(parsed.doc);

  if (rendered === null) {
    return (
      <Typography variant="body2" component="p" className="whitespace-pre-line">
        {value}
      </Typography>
    );
  }

  return (
    <Box sx={getRichTextContentSx} className="text-sm">
      {rendered}
    </Box>
  );
}
