import type { InternalStates, InternalActions } from '@app/presentation/stores';
import { StateCreator } from 'zustand';
import { Session } from '@infiniteuny/infinity-domain';

export interface InternalSessionStates {
  session: Session | undefined;
}

export interface InternalSessionActions {
  setSession: (session: Session | undefined) => void;
}

type InternalSessionSlice = StateCreator<
  InternalStates & InternalActions,
  [['zustand/immer', never]],
  [],
  InternalSessionStates & InternalSessionActions
>;

export function createInternalSessionSlice(
  ...[set]: Parameters<InternalSessionSlice>
): ReturnType<InternalSessionSlice> {
  return {
    session: undefined,

    setSession: (session: Session | undefined) => set(() => ({ session })),
  };
}
