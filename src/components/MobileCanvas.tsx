import type { ReactNode } from 'react';
import './css/MobileCanvas.css';

export function MobileCanvas({ children }: { children: ReactNode }) {
  return (
    <div className="app-outer">
      <div className="mobile-canvas">{children}</div>
    </div>
  );
}
