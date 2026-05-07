import { createStore } from 'zustand';
import {
  createInternalSessionSlice,
  createInternalSidebarSlice,
  InternalSessionActions,
  InternalSessionStates,
  InternalSidebarActions,
  InternalSidebarStates,
} from '@app/presentation/stores/internal';
import { immer } from 'zustand/middleware/immer';

export type InternalStates = InternalSidebarStates & InternalSessionStates;
export type InternalActions = InternalSidebarActions & InternalSessionActions;
export type InternalStoreApi = ReturnType<typeof createInternalStore>;

export function createInternalStore(initStates?: Partial<InternalStates>) {
  return createStore<InternalStates & InternalActions, [['zustand/immer', never]]>(
    immer((...a) => ({
      ...createInternalSessionSlice(...a),
      ...createInternalSidebarSlice(...a),
      ...initStates,
    })),
  );
}
