import { Extensions, JSONContent } from '@tiptap/core';
import { ReactNode } from 'react';
import { renderToReactElement } from '@tiptap/static-renderer/pm/react';
import { BASE_TIPTAP_EXTENSIONS } from './create-tiptap-extensions';

export function renderTiptapReactElement(
  doc: JSONContent,
  extensions: Extensions = BASE_TIPTAP_EXTENSIONS,
): ReactNode | null {
  try {
    return renderToReactElement({
      extensions,
      content: doc,
    });
  } catch {
    return null;
  }
}
