import { PublicActions, PublicStates } from '@app/presentation/stores';
import { StateCreator } from 'zustand';

export interface PublicHeaderStates {
  headerExpanded: boolean;
}

export interface PublicHeaderActions {
  setHeaderExpandedState: (state: boolean) => void;
}

type PublicHeaderStateCreator = StateCreator<
  PublicHeaderStates & PublicHeaderActions,
  [],
  [],
  PublicStates & PublicActions
>;

export function createPublicHeaderSlice(
  ...[set]: Parameters<PublicHeaderStateCreator>
): ReturnType<PublicHeaderStateCreator> {
  return {
    headerExpanded: true,

    setHeaderExpandedState: (state: boolean) => set(() => ({ headerExpanded: state })),
  };
}
