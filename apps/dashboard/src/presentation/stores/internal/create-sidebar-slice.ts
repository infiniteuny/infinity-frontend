import type { InternalStates, InternalActions } from '@app/presentation/stores';
import { clientContainer } from '@app/client-injection';
import { SetSidebarExtendedState } from '@infiniteuny/infinity-application';
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
  [],
  [],
  InternalSidebarStates & InternalSidebarActions
>;

export function createInternalSidebarSlice(
  ...[set]: Parameters<InternalSidebarStateCreator>
): ReturnType<InternalSidebarStateCreator> {
  let setSidebarExtendedStateUseCase: SetSidebarExtendedState | null = null;

  return {
    sidebarOpened: false,
    sidebarExtended: true,
    sidebarHovered: false,

    setSidebarOpenedState: (state: boolean) => set(() => ({ sidebarOpened: state })),
    setSidebarExtendedState: (state: boolean) => {
      if (!setSidebarExtendedStateUseCase) {
        setSidebarExtendedStateUseCase = clientContainer.get<SetSidebarExtendedState>(
          SYMBOLS.SetSidebarExtendedState,
        );
      }

      setSidebarExtendedStateUseCase.execute(state);
      set(() => ({ sidebarExtended: state }));
    },
    setSidebarHoveredState: (state: boolean) => set(() => ({ sidebarHovered: state })),
  };
}
