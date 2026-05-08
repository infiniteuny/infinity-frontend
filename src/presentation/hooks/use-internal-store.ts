import { InternalActions, InternalStates } from '@app/presentation/stores';
import { InternalStoreContext } from '@app/presentation/components/internal/shared';
import { useContext } from 'react';
import { useStore } from 'zustand';

export const useInternalStore = <T>(
  selector: (store: InternalStates & InternalActions) => T,
): T => {
  const internalStoreContext = useContext(InternalStoreContext);

  if (!internalStoreContext) {
    throw new Error(`useInternalStore must be used within InternalStoreProvider`);
  }

  return useStore(internalStoreContext, selector);
};
