'use client';

import {
  ArrowBackRounded,
  KeyboardDoubleArrowLeftRounded,
  KeyboardDoubleArrowRightRounded,
} from '@mui/icons-material';
import { SidebarDropdownMenu } from './dropdown-menu';
import { SidebarMenu } from './menu';
import { internalStore, useStore } from '@/presentation/hooks';
import { NestedMenu, PathMenu } from '@/domain/entities';
import { useEffect } from 'react';
import Link from 'next/link';

type Props = {
  title: string;
  menus: (PathMenu | NestedMenu<PathMenu[]>)[];
  backButton?: PathMenu;
};

export function InternalSidebar({ title, menus, backButton }: Props) {
  const sidebarOpened = useStore(internalStore, (s) => s.sidebarOpened);
  const [
    sidebarExtended,
    sidebarHovered,
    setSidebarOpenedState,
    getSidebarExtendedState,
    setSidebarExtendedState,
    setSidebarHoveredState,
  ] = useStore(internalStore, (s) => [
    s.sidebarExtended,
    s.sidebarHovered,
    s.setSidebarOpenedState,
    s.getSidebarExtendedState,
    s.setSidebarExtendedState,
    s.setSidebarHoveredState,
  ]);

  const hadleCoverClick = () => setSidebarOpenedState(false);
  const handleExtendButton = () => setSidebarExtendedState(!sidebarExtended);
  const handleMouseEnter = () => setSidebarHoveredState(true);
  const handleMouseLeave = () => setSidebarHoveredState(false);

  useEffect(() => {
    getSidebarExtendedState();
  }, [getSidebarExtendedState]);

  const sidebarHeader = (
    <header className="flex items-center sticky top-0 h-14 z-[11] pr-4 text-base text-white bg-infinite-green">
      <div className="flex shrink-0 items-center justify-center w-14 text-center">
        {backButton ? (
          <ArrowBackRounded
            className={`align-text-bottom ${sidebarExtended || sidebarHovered ? '' : 'lg:!hidden'}`}
          />
        ) : null}
        {!(sidebarExtended || sidebarHovered) ? (
          <span className="hidden h-10 w-10 font-medium text-lg lg:flex lg:items-center lg:justify-center">
            {title.charAt(0)}
          </span>
        ) : null}
      </div>
      <span className="font-medium text-lg text-ellipsis overflow-hidden">{title}</span>
    </header>
  );

  return (
    <>
      <div
        onClick={hadleCoverClick}
        className={`fixed left-0 top-0 w-full h-full z-[5] bg-black opacity-30 lg:hidden ${
          sidebarOpened ? '' : 'hidden'
        }`}
      />
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`flex flex-col fixed left-0 top-[74px] bottom-0 w-[260px] max-w-full z-10
        bg-white overflow-x-auto no-scrollbar transition-all lg:border-r lg:border-gray-300
        lg:translate-x-0 ${sidebarOpened ? 'translate-x-0' : '-translate-x-full'} ${
          sidebarExtended || sidebarHovered ? '' : 'lg:!w-14 lg:overflow-y-hidden'
        }`}
      >
        <div className="flex flex-col justify-between min-h-full">
          {backButton ? <Link href={backButton.path}>{sidebarHeader}</Link> : sidebarHeader}

          <ul className="flex flex-col relative mt-4 mb-auto text-left list-none lg:mb-16">
            {menus
              ? menus.map((menu, i) => {
                  if (menu.hasOwnProperty('path')) {
                    return <SidebarMenu key={i} menu={menu as PathMenu} />;
                  } else if (menu.hasOwnProperty('items')) {
                    return <SidebarDropdownMenu key={i} menu={menu as NestedMenu<PathMenu[]>} />;
                  }
                })
              : null}
          </ul>
          <footer
            className="hidden sticky bottom-0 z-[11] mt-auto text-infinite-green bg-white border-t
          border-gray-300 lg:flex lg:flex-col"
          >
            <button onClick={handleExtendButton} className="flex items-center h-14 pr-4 text-base ">
              <div className="shrink-0 h-[24px] w-14 text-center">
                {sidebarExtended ? (
                  <KeyboardDoubleArrowLeftRounded className="align-text-bottom" />
                ) : (
                  <KeyboardDoubleArrowRightRounded className="align-text-bottom" />
                )}
              </div>
              <span className="font-medium text-lg text-ellipsis overflow-hidden">
                {sidebarExtended ? 'Collapse' : 'Expand'}
              </span>
            </button>
          </footer>
        </div>
      </aside>
    </>
  );
}
