import { createStore } from 'zustand';
import {
  createInternalSessionSlice,
  createInternalSidebarSlice,
  InternalSessionActions,
  InternalSessionStates,
  InternalSidebarActions,
  InternalSidebarStates,
} from '@app/presentation/stores/internal';

export type InternalStates = InternalSidebarStates & InternalSessionStates;
export type InternalActions = InternalSidebarActions & InternalSessionActions;
export type InternalStoreApi = ReturnType<typeof createInternalStore>;

export function createInternalStore(initStates?: Partial<InternalStates>) {
  return createStore<InternalStates & InternalActions>((...a) => ({
    ...createInternalSessionSlice(...a),
    ...createInternalSidebarSlice(...a),
    ...initStates,
  }));
}
