import { create } from 'zustand';
import {
  createPublicHeaderSlice,
  PublicHeaderActions,
  PublicHeaderStates,
} from '@app/presentation/stores/public';
import { immer } from 'zustand/middleware/immer';

export type PublicStates = PublicHeaderStates;
export type PublicActions = PublicHeaderActions;

export function createPublicStore(initStates?: Partial<PublicStates>) {
  return create<PublicStates & PublicActions, [['zustand/immer', never]]>(
    immer((...a) => ({
      ...createPublicHeaderSlice(...a),
      ...initStates,
    })),
  );
}
