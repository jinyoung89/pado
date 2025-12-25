import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Paragraph } from '@toss/tds-mobile';
import { createOrUpdateTodayRecord, getSelectedWeather } from '../utils/storage';

type BreathingPhase = 'ready' | 'inhale' | 'hold' | 'exhale' | 'complete';

const BREATHING_MESSAGES: Record<BreathingPhase, string> = {
  ready: '하던 일을 멈추고 호흡에 집중하세요.',
  inhale: '숨을 들이쉬세요.',
  hold: '잠시 멈추세요.',
  exhale: '천천히 내쉬세요.',
  complete: '잘 하셨어요.',
};

export default function BreathingPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<BreathingPhase>('ready');
  const [isActive, setIsActive] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const startBreathing = useCallback(() => {
    setIsActive(true);
    setStartTime(Date.now());
    setPhase('inhale');
    setCycleCount(0);
  }, []);

  const completeBreathing = useCallback(() => {
    setPhase('complete');
    setIsActive(false);

    if (startTime) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      const weather = getSelectedWeather() || 'sunny';
      createOrUpdateTodayRecord(weather, undefined, {
        duration,
        completedAt: new Date().toISOString(),
      });
    }
  }, [startTime]);

  useEffect(() => {
    if (!isActive) return;

    let currentCycle = cycleCount;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const runCycle = () => {
      // 들이쉬기 4초
      setPhase('inhale');

      timers.push(setTimeout(() => {
        // 멈추기 2초
        setPhase('hold');
      }, 4000));

      timers.push(setTimeout(() => {
        // 내쉬기 4초
        setPhase('exhale');
      }, 6000));

      timers.push(setTimeout(() => {
        currentCycle += 1;
        setCycleCount(currentCycle);
        if (currentCycle >= 3) {
          completeBreathing();
        } else {
          runCycle();
        }
      }, 10000));
    };

    runCycle();

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [isActive, completeBreathing]);

  const handleBack = () => {
    navigate('/main');
  };

  const handleRestart = () => {
    setCycleCount(0);
    setPhase('ready');
    setIsActive(false);
    setStartTime(null);
  };

  return (
    <div className="full-screen" style={{ background: 'white' }}>
      <div className="breathing-container">
        <div className={`breathing-circle ${phase === 'inhale' || phase === 'hold' ? 'inhale' : 'exhale'}`}>
          {phase === 'complete' && <span style={{ fontSize: '40px', color: 'white' }}>✓</span>}
        </div>

        <Paragraph typography="t4" fontWeight="medium" style={{ marginTop: '40px', textAlign: 'center', color: 'var(--adaptive-grey-900, #191f28)' }}>
          {BREATHING_MESSAGES[phase]}
        </Paragraph>

        {phase === 'ready' && (
          <div style={{ marginTop: '48px' }}>
            <Button
              onClick={startBreathing}
              color="primary"
              size="large"
            >
              시작하기
            </Button>
          </div>
        )}

        {phase === 'complete' && (
          <div style={{ marginTop: '48px', display: 'flex', gap: '12px' }}>
            <Button
              onClick={handleRestart}
              variant="weak"
              size="large"
            >
              다시하기
            </Button>
            <Button
              onClick={handleBack}
              color="primary"
              size="large"
            >
              완료
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
