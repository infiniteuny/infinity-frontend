'use client';

import type { InternalStoreApi } from '@app/presentation/stores';
import { createContext } from 'react';

export const InternalStoreContext = createContext<InternalStoreApi | undefined>(undefined);
