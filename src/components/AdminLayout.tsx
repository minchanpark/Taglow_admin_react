import type { ReactNode } from 'react';
import { AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
import { MobileCanvas } from './MobileCanvas';
import { PageTransition } from './PageTransition';

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <MobileCanvas>
      <AnimatePresence mode="wait">
        <PageTransition>{children}</PageTransition>
      </AnimatePresence>
      <Toaster position="top-center" richColors />
    </MobileCanvas>
  );
}
