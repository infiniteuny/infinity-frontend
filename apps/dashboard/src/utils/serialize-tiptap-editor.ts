import { Editor } from '@tiptap/react';

export function serializeTiptapEditor(editor: Editor): string {
  return editor.isEmpty ? '' : JSON.stringify(editor.getJSON());
}
