import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, LogOut, X } from 'lucide-react';
import { AdminButton } from '../../../components/AdminButton';
import './css/ConfirmModal.css';

type ConfirmModalProps = {
  description: string;
  isOpen: boolean;
  tone?: 'default' | 'danger';
  title: string;
  actionLabel: string;
  onClose(): void;
  onConfirm(): void;
};

export function ConfirmModal({
  actionLabel,
  description,
  isOpen,
  onClose,
  onConfirm,
  title,
  tone = 'default',
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="confirm-backdrop"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.article
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="confirm-card"
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            onClick={(event) => event.stopPropagation()}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              aria-label="닫기"
              className="modal-close-button"
              onClick={onClose}
              type="button"
            >
              <X />
            </button>
            <div className={`confirm-icon confirm-icon-${tone}`}>
              {tone === 'danger' ? <AlertTriangle /> : <LogOut />}
            </div>
            <h2>{title}</h2>
            <p>{description}</p>
            <div className="confirm-actions">
              <AdminButton onClick={onClose} variant="secondary">
                취소
              </AdminButton>
              <AdminButton onClick={onConfirm} variant={tone === 'danger' ? 'danger' : 'primary'}>
                {actionLabel}
              </AdminButton>
            </div>
          </motion.article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
