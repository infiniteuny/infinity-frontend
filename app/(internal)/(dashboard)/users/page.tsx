import { SectionHeader } from '@app/presentation/components/internal/shared';
import { UsersList } from '@app/presentation/components/internal/users';
import { SessionProvider } from 'next-auth/react';

export default async function UsersPage() {
  return (
    <>
      <SessionProvider basePath="/auth">
        <SectionHeader title="Users" />
        <UsersList />
      </SessionProvider>
    </>
  );
}
