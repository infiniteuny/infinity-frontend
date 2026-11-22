export type TiptapJsonNode = {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: TiptapJsonNode[];
  marks?: {
    type: string;
    attrs?: Record<string, unknown>;
  }[];
  text?: string;
};

export function isTiptapDoc(value: unknown): value is TiptapJsonNode {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    (value as Record<string, unknown>).type === 'doc' &&
    Array.isArray((value as Record<string, unknown>).content)
  );
}
