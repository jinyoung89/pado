import { useState } from 'react';
import { ListRow, ListHeader, ConfirmDialog } from '@toss/tds-mobile';
import { clearAllRecords } from '../utils/storage';

export default function SettingsPage() {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleReset = () => {
    clearAllRecords();
    setIsResetDialogOpen(false);
  };

  return (
    <div className="full-screen" style={{ background: 'white', paddingTop: 'env(safe-area-inset-top)' }}>
      <ListHeader title="계정" />
      <ListRow
        contents={<ListRow.Texts type="2RowTypeA" top="토스 로그인" bottom="로그인하면 기록이 동기화돼요" />}
        right={<span style={{ color: '#b0b8c1', fontSize: '14px' }}>준비중</span>}
        border="none"
      />

      <ListHeader title="데이터" />
      <ListRow
        onClick={() => setIsResetDialogOpen(true)}
        contents={<ListRow.Texts type="2RowTypeA" top="기록 초기화" bottom="모든 일기와 심호흡 기록을 삭제해요" />}
        withArrow
        withTouchEffect
        border="none"
      />

      <ConfirmDialog
        open={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        title="기록을 초기화할까요?"
        description="모든 일기와 심호흡 기록이 삭제되며 복구할 수 없어요."
        cancelButton={<ConfirmDialog.CancelButton onClick={() => setIsResetDialogOpen(false)}>취소</ConfirmDialog.CancelButton>}
        confirmButton={<ConfirmDialog.ConfirmButton onClick={handleReset}>초기화</ConfirmDialog.ConfirmButton>}
      />
    </div>
  );
}
