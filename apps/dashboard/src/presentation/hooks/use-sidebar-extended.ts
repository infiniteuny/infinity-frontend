import { useInternalStoreContext } from './use-internal-store-context';
import { useSyncExternalStore } from 'react';

const getServerSnapshot = () => true;

export function useSidebarExtended(): boolean {
  const store = useInternalStoreContext();

  return useSyncExternalStore(
    store.subscribe,
    () => store.getState().sidebarExtended,
    getServerSnapshot,
  );
}
