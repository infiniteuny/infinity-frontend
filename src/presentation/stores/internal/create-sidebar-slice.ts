import type { InternalStates, InternalActions } from '@app/presentation/stores';
import { clientContainer } from '@app/client-injection';
import { SetSidebarExtendedState } from '@app/application';
import { StateCreator } from 'zustand';
import { SYMBOLS } from '@config';

export interface InternalSidebarStates {
  sidebarOpened: boolean;
  sidebarExtended: boolean;
  sidebarHovered: boolean;
}

export interface InternalSidebarActions {
  setSidebarOpenedState: (state: boolean) => void;
  setSidebarExtendedState: (state: boolean) => void;
  setSidebarHoveredState: (state: boolean) => void;
}

type InternalSidebarStateCreator = StateCreator<
  InternalStates & InternalActions,
  [['zustand/immer', never]],
  [],
  InternalSidebarStates & InternalSidebarActions
>;

export function createInternalSidebarSlice(
  ...[set]: Parameters<InternalSidebarStateCreator>
): ReturnType<InternalSidebarStateCreator> {
  return {
    sidebarOpened: false,
    sidebarExtended: true,
    sidebarHovered: false,

    setSidebarOpenedState: (state: boolean) => set(() => ({ sidebarOpened: state })),
    setSidebarExtendedState: (state: boolean) => {
      const setSidebarExtendedState = clientContainer.get<SetSidebarExtendedState>(
        SYMBOLS.SetSidebarExtendedState,
      );

      setSidebarExtendedState.execute(state);
      set(() => ({ sidebarExtended: state }));
    },
    setSidebarHoveredState: (state: boolean) => set(() => ({ sidebarHovered: state })),
  };
}
