import { APP } from '@config';
import {
  InternalMainContainer,
  InternalSidebar,
} from '@app/presentation/components/internal/shared';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <>
      <InternalSidebar menus={APP.internal.sidebar.menus} />
      <InternalMainContainer>{children}</InternalMainContainer>
    </>
  );
}
