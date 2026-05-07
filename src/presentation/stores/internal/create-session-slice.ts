import type { InternalStates, InternalActions } from '@app/presentation/stores';
import { StateCreator } from 'zustand';
import { Session } from '@app/domain/entities';

export interface InternalSessionStates {
  session: Session | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InternalSessionActions {}

type InternalSessionSlice = StateCreator<
  InternalStates & InternalActions,
  [['zustand/immer', never]],
  [],
  InternalSessionStates & InternalSessionActions
>;

export function createInternalSessionSlice(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ...[_]: Parameters<InternalSessionSlice>
): ReturnType<InternalSessionSlice> {
  return {
    session: undefined,
  };
}
