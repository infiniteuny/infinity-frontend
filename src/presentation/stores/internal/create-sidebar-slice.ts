import { clientContainer } from '@app/client-injection';
import { GetSidebarExtendedState, SetSidebarExtendedState } from '@app/application';
import { InternalActions, InternalStates } from '@app/presentation/stores';
import { StateCreator } from 'zustand';
import { SYMBOLS } from '@config';

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
      const getSidebarExtendedState = clientContainer.get<GetSidebarExtendedState>(
        SYMBOLS.GetSidebarExtendedState,
      );

      set(() => ({ sidebarExtended: getSidebarExtendedState.execute() }));
    },
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
