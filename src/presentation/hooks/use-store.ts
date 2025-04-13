'use client';

import { createInternalStore, createPublicStore } from '@/presentation/stores';
import { useShallow } from 'zustand/shallow';
import { useStore } from 'zustand';

export const internalStore = createInternalStore();
export const publicStore = createPublicStore();

export { useShallow, useStore };
