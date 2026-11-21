import { useInternalStore } from './use-internal-store';
import { useMemo } from 'react';

const EMPTY_PERMISSIONS: readonly string[] = [];

export function useUserPermissions(): ReadonlySet<string> {
  const permissions = useInternalStore((s) => s.session?.permissions ?? EMPTY_PERMISSIONS);

  return useMemo(() => new Set(permissions), [permissions]);
}
