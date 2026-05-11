'use client';

import isMobilePhone from 'validator/es/lib/isMobilePhone';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { ContactsForm } from './contacts-form';
import { CreateUser, UpdateUser } from '@app/application';
import { FacultyDto, MajorDto, UserDto, UserMapper } from '@app/infrastructure/dtos';
import { GeneralForm } from './general-form';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { match } from 'effect/Either';
import { MembershipForm } from './membership-form';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UserToolbar } from './user-toolbar';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const userInputSchema = z
  .object({
    name: z.string().min(1, 'Name must not be empty'),
    username: z
      .string()
      .min(4, 'Username must be at least 4 characters long')
      .max(20, 'Username must be at most 20 characters long')
      .regex(/^(?!.*(\.{2}|_{2}|\._|_\.))\w(?:[\w.]*\w)?$/, 'Username must be valid'),
    emailAddress: z.email('Email address must be valid'),
    phoneNumber: z.string().refine(isMobilePhone, {
      message: 'Phone number must be valid',
    }),
    studentId: z
      .string()
      .regex(/^[0-9]+$/, 'Student ID must contain only numbers')
      .length(11, 'Student ID must be 11 characters long'),
    facultyId: z.uuidv7('Faculty must be selected'),
    majorId: z.uuidv7('Major must be selected'),
    startDate: z.date('Start date must be a valid date').nullable(),
    endDate: z.date('End date must be a valid date').nullable(),
    isMember: z.boolean(),
    isExtraordinary: z.boolean(),
    linkedin: z.string('LinkedIn username must be valid').nullable(),
    github: z.string('GitHub username must be valid').nullable(),
    discord: z.string('Discord username must be valid').nullable(),
  })
  .refine((data) => !data.startDate || !data.endDate || data.startDate < data.endDate, {
    message: 'Start date must be earlier than end date.',
    path: ['startDate'],
  })
  .refine((data) => !data.startDate || !data.endDate || data.endDate > data.startDate, {
    message: 'End date must be later than start date.',
    path: ['endDate'],
  });

export type UserInput = z.infer<typeof userInputSchema>;

type Props = {
  initialUser?: UserDto;
  faculties: FacultyDto[];
  majors?: MajorDto[];
};

export function UserForm({ initialUser, faculties, majors }: Props) {
  const createUser = useMemo(() => clientContainer.get<CreateUser>(SYMBOLS.CreateUser), []);
  const updateUser = useMemo(() => clientContainer.get<UpdateUser>(SYMBOLS.UpdateUser), []);
  const router = useRouter();

  const user = initialUser ? UserMapper.fromDtoToDomain(initialUser) : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<UserInput>({
    mode: 'all',
    // Bug workaround for https://github.com/colinhacks/zod/issues/3537
    resolver: zodResolver(userInputSchema) as Resolver<UserInput>,
    defaultValues: user
      ? {
          ...user,
          facultyId: user.major?.facultyId,
          linkedin: user.links?.linkedin || '',
          github: user.links?.github || '',
          discord: user.links?.discord || '',
        }
      : {
          name: '',
          username: '',
          emailAddress: '',
          phoneNumber: '',
          studentId: '',
          facultyId: '0',
          majorId: '0',
          startDate: null,
          endDate: null,
          isMember: false,
          isExtraordinary: false,
          linkedin: '',
          github: '',
          discord: '',
        },
  });

  const { handleSubmit: submit, control, formState } = methods;

  const name = useWatch({ name: 'name', control });

  const handleSubmit = submit(async (data) => {
    if (formState.isDirty) {
      try {
        if (!user) {
          // TODO: Add snackbar for loading state
          const userResult = await createUser.execute({
            ...data,
            links: {
              ...(data.linkedin ? { linkedin: data.linkedin } : {}),
              ...(data.github ? { github: data.github } : {}),
              ...(data.discord ? { discord: data.discord } : {}),
            },
          });

          match(userResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              // TODO: Add snackbar for success state
              router.push(`/users/${data.id}`);
            },
          });
        } else {
          const userResult = await updateUser.execute(user.id, {
            ...data,
            links: {
              ...(data.linkedin || user.links?.linkedin
                ? { linkedin: data.linkedin || user.links?.linkedin }
                : {}),
              ...(data.github || user.links?.github
                ? { github: data.github || user.links?.github }
                : {}),
              ...(data.discord || user.links?.discord
                ? { discord: data.discord || user.links?.discord }
                : {}),
            },
          });

          match(userResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              // TODO: Add snackbar for success state
              router.push(`/users/${data.id}`);
            },
          });
        }
      } catch (error) {
        // TODO: Implement proper error handling and add snackbar for error state
        console.error('Error submitting user form:', error);
      }
    }
  });

  return (
    <>
      <SectionHeader title={user ? name : 'Create User'}>
        <UserToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
          <GeneralForm methods={methods} faculties={faculties} majors={majors} />
          <ContactsForm methods={methods} />
          <MembershipForm methods={methods} />
        </Box>
      </LocalizationProvider>
    </>
  );
}
