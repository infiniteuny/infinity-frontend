'use client';

import { Config } from '@/config';
import { InternalSidebar } from '@/presentation/components/internal/shared';
import { internalStore, useStore } from '@/presentation/hooks';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const sidebarExtended = useStore(internalStore, (s) => s.sidebarExtended);

  return (
    <div className="mt-[74px]">
      <InternalSidebar
        title={Config.internal.dashboard.sidebar.title}
        menus={Config.internal.dashboard.sidebar.menus}
      />
      <main
        className={`min-h-[calc(100vh-74px-3rem)] ${
          sidebarExtended ? 'lg:ml-[260px]' : 'lg:ml-14'
        }`}
      >
        {children}
      </main>
    </div>
  );
}
