import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import './css/PageTransition.css';

const transition = { duration: 0.3, ease: [0.22, 1, 0.36, 1] } as const;

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      className="page-transition"
      exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
      initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
