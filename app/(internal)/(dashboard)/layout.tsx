import { APP } from '@config';
import { InternalMain, InternalSidebar } from '@app/presentation/components/internal/shared';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <SessionProvider basePath="/auth">
      <InternalSidebar menus={APP.internal.sidebar.menus} />
      <InternalMain>{children}</InternalMain>
    </SessionProvider>
  );
}
