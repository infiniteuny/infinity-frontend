import { InternalActions, InternalStates } from '@app/presentation/stores';
import { useInternalStoreContext } from './use-internal-store-context';
import { useStore } from 'zustand';

export const useInternalStore = <T>(
  selector: (store: InternalStates & InternalActions) => T,
): T => {
  return useStore(useInternalStoreContext(), selector);
};
