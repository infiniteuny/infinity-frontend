import { createStore } from 'zustand';
import {
  createInternalSidebarSlice,
  InternalSidebarActions,
  InternalSidebarStates,
} from '@app/presentation/stores/internal';
import { immer } from 'zustand/middleware/immer';

export type InternalStates = InternalSidebarStates;
export type InternalActions = InternalSidebarActions;

export function createInternalStore(initStates?: Partial<InternalStates>) {
  return createStore<InternalStates & InternalActions, [['zustand/immer', never]]>(
    immer((...a) => ({
      ...createInternalSidebarSlice(...a),
      ...initStates,
    })),
  );
}
