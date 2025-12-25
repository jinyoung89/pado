import { useState, useEffect, useCallback } from 'react';
import { Button, AlertDialog } from '@toss/tds-mobile';

interface TimerOption {
  label: string;
  minutes: number;
}

const TIMER_OPTIONS: TimerOption[] = [
  { label: '15분', minutes: 15 },
  { label: '30분', minutes: 30 },
  { label: '1시간', minutes: 60 },
  { label: '2시간', minutes: 120 },
];

// 전역 타이머 상태 (페이지 이동 후에도 유지)
let globalTimerEnd: number | null = null;

export function getTimerRemaining(): number | null {
  if (!globalTimerEnd) return null;
  const remaining = globalTimerEnd - Date.now();
  return remaining > 0 ? remaining : null;
}

export function cancelGlobalTimer() {
  globalTimerEnd = null;
}

export default function TimerPage() {
  const [remainingTime, setRemainingTime] = useState<number | null>(getTimerRemaining());
  const [isTimerActive, setIsTimerActive] = useState(!!globalTimerEnd);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);

  // 시간 포맷팅 (mm:ss 또는 hh:mm:ss)
  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // 타이머 시작
  const startTimer = (minutes: number) => {
    globalTimerEnd = Date.now() + minutes * 60 * 1000;
    setIsTimerActive(true);
    setRemainingTime(minutes * 60 * 1000);
  };

  // 타이머 취소
  const handleCancelTimer = () => {
    cancelGlobalTimer();
    setIsTimerActive(false);
    setRemainingTime(null);
  };

  // 타이머 카운트다운
  useEffect(() => {
    if (!isTimerActive) return;

    const interval = setInterval(() => {
      const remaining = getTimerRemaining();
      if (remaining === null || remaining <= 0) {
        // 타이머 완료
        cancelGlobalTimer();
        setIsTimerActive(false);
        setRemainingTime(null);
        setIsCompleteDialogOpen(true);
      } else {
        setRemainingTime(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive]);

  return (
    <div className="full-screen" style={{ background: 'var(--adaptive-grey-50, #f7f7f7)' }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        {isTimerActive && remainingTime ? (
          // 타이머 활성화 상태
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              남은 시간
            </p>
            <div style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '40px',
            }}>
              {formatTime(remainingTime)}
            </div>
            <Button
              onClick={handleCancelTimer}
              variant="weak"
              size="large"
            >
              타이머 취소
            </Button>
          </div>
        ) : (
          // 타이머 선택 상태
          <div style={{ width: '100%', maxWidth: '300px' }}>
            <p style={{
              color: '#666',
              textAlign: 'center',
              marginBottom: '30px',
            }}>
              설정한 시간 후에 음악이 종료됩니다
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}>
              {TIMER_OPTIONS.map((option) => (
                <Button
                  key={option.minutes}
                  onClick={() => startTimer(option.minutes)}
                  variant="weak"
                  size="large"
                  style={{ height: '80px' }}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <AlertDialog
        open={isCompleteDialogOpen}
        onClose={() => setIsCompleteDialogOpen(false)}
        title="타이머 종료"
        description="설정한 시간이 지났어요."
        alertButton={<AlertDialog.AlertButton onClick={() => setIsCompleteDialogOpen(false)}>확인</AlertDialog.AlertButton>}
      />
    </div>
  );
}
