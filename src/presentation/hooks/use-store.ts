import { createInternalStore } from '@app/presentation/stores';
import { useShallow } from 'zustand/shallow';
import { useStore } from 'zustand';

export const internalStore = createInternalStore();

export { useShallow, useStore };
