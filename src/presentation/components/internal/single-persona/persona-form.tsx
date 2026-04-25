'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreatePersona, UpdatePersona } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { PersonaDto, PersonaMapper } from '@app/infrastructure/dtos';
import { PersonaToolbar } from './persona-toolbar';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const personaInputSchema = z.object({
  name: z.string().min(1, 'Name must not be empty'),
  priority: z.number('Priority must be a number').min(0, 'Priority must be non-negative'),
  description: z.string().min(1, 'Description must not be empty'),
  logo: z.string().min(1, 'Logo must not be empty'),
});

export type PersonaInput = z.infer<typeof personaInputSchema>;

type Props = {
  initialPersona?: PersonaDto;
};

export function PersonaForm({ initialPersona }: Props) {
  const createPersona = useMemo(
    () => clientContainer.get<CreatePersona>(SYMBOLS.CreatePersona),
    [],
  );
  const updatePersona = useMemo(
    () => clientContainer.get<UpdatePersona>(SYMBOLS.UpdatePersona),
    [],
  );
  const router = useRouter();

  const persona = initialPersona ? PersonaMapper.fromDtoToDomain(initialPersona) : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<PersonaInput>({
    mode: 'all',
    resolver: zodResolver(personaInputSchema) as Resolver<PersonaInput>,
    defaultValues: persona
      ? {
          ...persona,
        }
      : {
          name: '',
          priority: 0,
          description: '',
          logo: '',
        },
  });

  const { handleSubmit: submit, control, formState } = methods;

  const name = useWatch({ name: 'name', control });

  const handleSubmit = submit(async (data) => {
    if (formState.isDirty) {
      try {
        if (!persona) {
          const personaResult = await createPersona.execute(data);

          match(personaResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/personas/${data.id}`);
            },
          });
        } else {
          const personaResult = await updatePersona.execute(persona.id, data);

          match(personaResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              router.push(`/personas/${data.id}`);
            },
          });
        }
      } catch (error) {
        console.error('Error submitting persona form:', error);
      }
    }
  });

  return (
    <>
      <SectionHeader title={persona ? name : 'Create Persona'}>
        <PersonaToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
