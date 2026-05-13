import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { useState, type PropsWithChildren } from 'react';
import { createQueryClient } from './queryClient';
import { AdminRuntimeProvider } from '../api/runtime/adminRuntime';

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <AdminRuntimeProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </AdminRuntimeProvider>
    </QueryClientProvider>
  );
}