import { TiptapJsonNode } from './is-tiptap-doc';

export const EMPTY_TIPTAP_DOC: TiptapJsonNode = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

export function plainTextToTiptapDoc(text: string): TiptapJsonNode {
  if (!text) {
    return EMPTY_TIPTAP_DOC;
  }

  const lines = text.split(/\r?\n/);

  return {
    type: 'doc',
    content: lines.map((line) =>
      line.length > 0
        ? {
            type: 'paragraph',
            content: [{ type: 'text', text: line }],
          }
        : {
            type: 'paragraph',
          },
    ),
  };
}
