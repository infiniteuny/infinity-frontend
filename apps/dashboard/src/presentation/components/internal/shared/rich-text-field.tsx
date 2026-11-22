'use client';

import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { RichTextEditor } from './rich-text-editor';

type Props<TFieldValues extends FieldValues, TName extends Path<TFieldValues>> = {
  name: TName;
  control: Control<TFieldValues>;
  id: string;
  label: string;
  placeholder?: string;
  isSubmitting: boolean;
  errorMessage?: string;
  minHeight?: number;
};

export function RichTextField<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>({
  name,
  control,
  id,
  label,
  placeholder = 'Write something...',
  isSubmitting,
  errorMessage,
  minHeight = 160,
}: Props<TFieldValues, TName>) {
  const hasError = Boolean(errorMessage);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, onBlur, ref } }) => (
        <RichTextEditor
          id={id}
          label={label}
          value={typeof value === 'string' ? value : ''}
          placeholder={placeholder}
          isSubmitting={isSubmitting}
          hasError={hasError}
          errorMessage={errorMessage}
          minHeight={minHeight}
          onChange={onChange}
          onBlur={onBlur}
          fieldRef={ref}
        />
      )}
    />
  );
}
