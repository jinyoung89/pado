import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomCTA } from '@toss/tds-mobile';
import { getTodayRecord, createOrUpdateTodayRecord, getSelectedWeather } from '../utils/storage';

export default function DiaryPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');

  useEffect(() => {
    const todayRecord = getTodayRecord();
    if (todayRecord?.diary?.type === 'free') {
      setContent(todayRecord.diary.content);
    }
  }, []);

  const handleSave = () => {
    const weather = getSelectedWeather() || 'sunny';
    createOrUpdateTodayRecord(weather, {
      type: 'free',
      content,
      answers: [],
    });
    navigate('/main');
  };

  return (
    <div className="full-screen" style={{ background: 'var(--adaptive-grey-50, #f7f7f7)' }}>
      <div style={{ padding: '24px', flex: 1, overflow: 'auto' }}>
        <textarea
          placeholder="내 마음을 글로 남겨두는 건 어떨까요?&#10;누구와 무엇을 했는지, 내 기분은 어땠는지 자유롭게 기록해보세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          autoFocus
          style={{
            width: '100%',
            height: '300px',
            padding: '16px',
            fontSize: '15px',
            lineHeight: '1.6',
            border: 'none',
            borderRadius: '12px',
            background: 'white',
            resize: 'none',
            color: '#191f28',
          }}
        />
      </div>

      <BottomCTA onClick={handleSave}>
        저장하기
      </BottomCTA>
    </div>
  );
}
