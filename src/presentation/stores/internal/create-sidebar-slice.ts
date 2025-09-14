import { getSidebarExtendedState, setSidebarExtendedState } from '@app/application/client';
import { InternalActions, InternalStates } from '@app/presentation/stores';
import { StateCreator } from 'zustand';

export interface InternalSidebarStates {
  sidebarOpened: boolean;
  sidebarExtended: boolean;
  sidebarHovered: boolean;
}

export interface InternalSidebarActions {
  setSidebarOpenedState: (state: boolean) => void;
  getSidebarExtendedState: () => void;
  setSidebarExtendedState: (state: boolean) => void;
  setSidebarHoveredState: (state: boolean) => void;
}

type InternalSidebarStateCreator = StateCreator<
  InternalSidebarStates & InternalSidebarActions,
  [],
  [],
  InternalStates & InternalActions
>;

export function createInternalSidebarSlice(
  ...[set]: Parameters<InternalSidebarStateCreator>
): ReturnType<InternalSidebarStateCreator> {
  return {
    sidebarOpened: false,
    sidebarExtended: true,
    sidebarHovered: false,

    setSidebarOpenedState: (state: boolean) => set(() => ({ sidebarOpened: state })),
    getSidebarExtendedState: () => {
      set(() => ({ sidebarExtended: getSidebarExtendedState() }));
    },
    setSidebarExtendedState: (state: boolean) => {
      setSidebarExtendedState(state);
      set(() => ({ sidebarExtended: state }));
    },
    setSidebarHoveredState: (state: boolean) => set(() => ({ sidebarHovered: state })),
  };
}
