import React, { useEffect } from 'react';
import './Modal.css';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  isOpen: boolean;
}

export const Modal: React.FC<ModalProps> = ({ children, onClose, isOpen }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-container">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content" role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
};
