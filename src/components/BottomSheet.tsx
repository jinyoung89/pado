import type { ReactNode } from 'react';
import { useEffect } from 'react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="bottom-sheet-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <div
        className="bottom-sheet-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          background: 'white',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          paddingBottom: 'env(safe-area-inset-bottom)',
          maxHeight: '80vh',
          overflow: 'auto',
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        <div style={{
          width: '40px',
          height: '4px',
          background: '#ddd',
          borderRadius: '2px',
          margin: '12px auto',
        }} />
        {children}
      </div>
    </div>
  );
}
