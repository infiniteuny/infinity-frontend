'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateUserPersona } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { UserPersonaToolbar } from './user-persona-toolbar';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const userPersonaInputSchema = z.object({
  personaId: z.uuidv7('Persona must be selected'),
});

export type UserPersonaInput = z.infer<typeof userPersonaInputSchema>;

type Props = {
  userId: string;
};

export function UserPersonaForm({ userId }: Props) {
  const createUserPersona = useMemo(
    () => clientContainer.get<CreateUserPersona>(SYMBOLS.CreateUserPersona),
    [],
  );
  const router = useRouter();

  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<UserPersonaInput>({
    mode: 'all',
    // Bug workaround for https://github.com/colinhacks/zod/issues/3537
    resolver: zodResolver(userPersonaInputSchema) as Resolver<UserPersonaInput>,
    defaultValues: {
      personaId: '',
    },
  });

  const { handleSubmit: submit, formState } = methods;

  const handleSubmit = submit(async (data) => {
    if (!formState.isDirty) {
      return;
    }

    const result = await createUserPersona.execute(userId, data);

    match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: () => {
        router.push(`/users/${userId}/personas`);
      },
    });
  });

  return (
    <>
      <SectionHeader title="Add User Persona">
        <UserPersonaToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
