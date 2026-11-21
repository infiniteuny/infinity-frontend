import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ValidationError } from '@infiniteuny/infinity-domain';

function toCamelCase(value: string): string {
  return value.replace(/_([a-z0-9])/g, (_, char: string) => char.toUpperCase());
}

function resolveFieldKey(key: string, fieldMap?: Record<string, string>): string {
  if (fieldMap && key in fieldMap) {
    return fieldMap[key];
  }

  const normalized = key.startsWith('links.') ? key.slice('links.'.length) : key;
  return toCamelCase(normalized);
}

export function handleFormError<TFieldValues extends FieldValues>(
  error: unknown,
  methods: UseFormReturn<TFieldValues>,
  fallbackMessage = 'An unexpected error occurred. Please try again.',
  fieldMap?: Record<string, Path<TFieldValues>>,
): void {
  if (error instanceof ValidationError && error.data) {
    const currentValues = methods.getValues() as Record<string, unknown>;
    const unmappedMessages: string[] = [];
    let mappedCount = 0;

    for (const [rawKey, messages] of Object.entries(error.data)) {
      const firstMessage = Array.isArray(messages) ? messages[0] : undefined;
      if (!firstMessage) continue;

      const candidateKey = resolveFieldKey(rawKey, fieldMap);
      if (Object.prototype.hasOwnProperty.call(currentValues, candidateKey)) {
        methods.setError(candidateKey as Path<TFieldValues>, {
          type: 'server',
          message: firstMessage,
        });
        mappedCount += 1;
      } else {
        unmappedMessages.push(firstMessage);
      }
    }

    if (unmappedMessages.length > 0) {
      toast.error(unmappedMessages[0]);
      return;
    }

    if (mappedCount > 0) {
      toast.error(error.message || 'Please check the highlighted fields.');
      return;
    }
  }

  const message = error instanceof Error && error.message ? error.message : fallbackMessage;
  toast.error(message);
}
