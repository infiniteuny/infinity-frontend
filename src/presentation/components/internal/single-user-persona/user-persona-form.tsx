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
import { UserDto, UserMapper } from '@app/infrastructure/dtos';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const userPersonaInputSchema = z.object({
  personaId: z.uuidv7('Persona must be selected'),
});

export type UserPersonaInput = z.infer<typeof userPersonaInputSchema>;

type Props = {
  user: UserDto;
  isProfileForm?: boolean;
};

export function UserPersonaForm({ user, isProfileForm }: Props) {
  const createUserPersona = useMemo(
    () => clientContainer.get<CreateUserPersona>(SYMBOLS.CreateUserPersona),
    [],
  );
  const parsedUser = useMemo(() => UserMapper.fromDtoToDomain(user), [user]);
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

    const result = await createUserPersona.execute(parsedUser.id, data);

    match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: () => {
        router.push(
          isProfileForm ? `/settings/profile/personas` : `/users/${parsedUser.id}/personas`,
        );
      },
    });
  });

  return (
    <>
      <SectionHeader
        title={isProfileForm ? 'Add Persona' : `Add ${parsedUser.name}'s Persona`}
        backUrl={isProfileForm ? `/settings/profile/personas` : `/users/${parsedUser.id}/personas`}
      >
        <UserPersonaToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
