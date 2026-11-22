import { isTiptapDoc, TiptapJsonNode } from './is-tiptap-doc';
import { EMPTY_TIPTAP_DOC, plainTextToTiptapDoc } from './plain-text-to-tiptap-doc';

export type ParsedTiptapContent = {
  kind: 'empty' | 'json' | 'legacy-text';
  doc: TiptapJsonNode;
};

export function parseTiptapContent(value: string | null | undefined): ParsedTiptapContent {
  if (!value) {
    return {
      kind: 'empty',
      doc: EMPTY_TIPTAP_DOC,
    };
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (isTiptapDoc(parsed)) {
      return {
        kind: 'json',
        doc: parsed,
      };
    }
  } catch {
    // Fallback to legacy plain string handling below
  }

  return {
    kind: 'legacy-text',
    doc: plainTextToTiptapDoc(value),
  };
}
