import type { ReactNode } from 'react';
import { AnimatePresence } from 'motion/react';
import { MobileCanvas } from './MobileCanvas';
import { PageTransition } from './PageTransition';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <MobileCanvas>
      <AnimatePresence mode="wait">
        <PageTransition>{children}</PageTransition>
      </AnimatePresence>
    </MobileCanvas>
  );
}
