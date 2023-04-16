import { container } from '@/injection';
import { GetSidebarExtendedState, SetSidebarExtendedState } from '@/application/internal';
import { InternalActions, InternalStates } from '@/presentation/stores';
import { StateCreator } from 'zustand';
import { Symbols } from '@/config';

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
      const getSidebarExtendedState = container.get<GetSidebarExtendedState>(
        Symbols.GetSidebarExtendedState,
      );

      set(() => ({ sidebarExtended: getSidebarExtendedState.execute() }));
    },
    setSidebarExtendedState: (state: boolean) => {
      const setSidebarExtendedState = container.get<SetSidebarExtendedState>(
        Symbols.SetSidebarExtendedState,
      );

      setSidebarExtendedState.execute(state);
      set(() => ({ sidebarExtended: state }));
    },
    setSidebarHoveredState: (state: boolean) => set(() => ({ sidebarHovered: state })),
  };
}
