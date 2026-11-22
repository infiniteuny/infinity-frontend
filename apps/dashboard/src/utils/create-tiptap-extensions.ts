import { Extensions } from '@tiptap/core';
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';

export const BASE_TIPTAP_EXTENSIONS: Extensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      enableClickSelection: true,
      HTMLAttributes: {
        rel: 'noopener noreferrer',
        target: '_blank',
      },
    },
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
];

export function createTiptapExtensions(placeholder?: string): Extensions {
  if (!placeholder) {
    return BASE_TIPTAP_EXTENSIONS;
  }

  return [
    ...BASE_TIPTAP_EXTENSIONS,
    Placeholder.configure({
      placeholder,
    }),
  ];
}
