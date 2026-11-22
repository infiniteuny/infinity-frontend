import { TiptapJsonNode } from './is-tiptap-doc';
import { parseTiptapContent } from './parse-tiptap-content';

function hasNodeText(node: TiptapJsonNode): boolean {
  if (typeof node.text === 'string' && node.text.trim().length > 0) {
    return true;
  }

  return Array.isArray(node.content) && node.content.some(hasNodeText);
}

export function hasRichTextContent(value: string | null | undefined): boolean {
  if (!value || value.trim().length === 0) {
    return false;
  }

  const parsed = parseTiptapContent(value);
  return hasNodeText(parsed.doc);
}
