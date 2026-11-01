import { InternalStoreContext } from '@app/presentation/components/internal/shared/store-context';
import { useContext } from 'react';

export const useInternalStoreContext = () => {
  const internalStoreContext = useContext(InternalStoreContext);

  if (!internalStoreContext) {
    throw new Error(`useInternalStore must be used within InternalStoreProvider`);
  }

  return internalStoreContext;
};
