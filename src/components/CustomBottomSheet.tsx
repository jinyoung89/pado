import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Paragraph } from '@toss/tds-mobile';

interface CustomBottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function CustomBottomSheet({ open, onClose, title, children }: CustomBottomSheetProps) {
  // 바텀시트가 열릴 때 body 스크롤 방지
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

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div className="custom-bottomsheet-overlay" onClick={handleOverlayClick}>
      <div
        className="custom-bottomsheet-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="custom-bottomsheet-header">
          <Paragraph typography="t4" fontWeight="bold">
            {title}
          </Paragraph>
        </div>
        <div className="custom-bottomsheet-content">
          {children}
        </div>
      </div>
    </div>
  );
}
