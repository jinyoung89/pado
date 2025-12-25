import { useState, useMemo } from 'react';
import { BottomSheet } from '@toss/tds-mobile';
import { getAllRecords, getRecord } from '../utils/storage';
import type { DayRecord } from '../types';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRecord, setSelectedRecord] = useState<DayRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const records = useMemo(() => {
    const allRecords = getAllRecords();
    const recordMap: Record<string, string> = {};
    Object.values(allRecords).forEach((record) => {
      recordMap[record.date] = record.weatherType;
    });
    return recordMap;
  }, []);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const today = new Date().toISOString().split('T')[0];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const getWeatherEmoji = (weatherType: string) => {
    const emojis: Record<string, string> = {
      sunny: '☀️',
      cloudy: '☁️',
      rainy: '🌧️',
      storm: '⛈️',
      sunshower: '🌦️',
      foggy: '🌫️',
      snowy: '❄️',
    };
    return emojis[weatherType] || '';
  };

  const getWeatherLabel = (weatherType: string) => {
    const labels: Record<string, string> = {
      sunny: '맑음',
      cloudy: '흐림',
      rainy: '비',
      storm: '폭풍',
      sunshower: '소나기',
      foggy: '안개',
      snowy: '눈',
    };
    return labels[weatherType] || '';
  };

  const handleDayClick = (dateStr: string) => {
    const record = getRecord(dateStr);
    if (record) {
      setSelectedRecord(record);
      setIsDetailOpen(true);
    }
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedRecord(null);
  };

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const days = [];

  // 빈 칸 (월 시작 전)
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day" />);
  }

  // 날짜들
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const hasRecord = records[dateStr];
    const isToday = dateStr === today;

    days.push(
      <div
        key={day}
        className={`calendar-day ${hasRecord ? 'has-record' : ''} ${isToday ? 'today' : ''}`}
        onClick={() => hasRecord && handleDayClick(dateStr)}
        style={{ cursor: hasRecord ? 'pointer' : 'default' }}
      >
        <span>{day}</span>
        {hasRecord && (
          <span style={{ fontSize: '12px' }}>{getWeatherEmoji(hasRecord)}</span>
        )}
      </div>
    );
  }

  return (
    <div className="full-screen" style={{ background: 'var(--adaptive-grey-50, #f7f7f7)' }}>
      <div style={{ padding: '16px', background: 'white', margin: '8px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#191f28' }}>
            {year}년 {month}월
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePrevMonth}
              style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', padding: '4px 8px' }}
            >
              ‹
            </button>
            <button
              onClick={handleNextMonth}
              style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', padding: '4px 8px' }}
            >
              ›
            </button>
          </div>
        </div>

        <div className="calendar-weekdays" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '8px' }}>
          {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
            <span key={day} style={{ fontSize: '12px', color: i === 0 ? '#f04452' : i === 6 ? '#3182f6' : '#666' }}>{day}</span>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {days}
        </div>
      </div>

      {/* 기록 상세 바텀시트 */}
      <BottomSheet open={isDetailOpen && !!selectedRecord} onDimmerClick={closeDetail}>
        {selectedRecord && (
          <>
            <BottomSheet.Header>{formatDisplayDate(selectedRecord.date)}</BottomSheet.Header>
            <div style={{ padding: '16px 20px 24px' }}>
              {/* 날씨 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <span style={{ fontSize: '40px' }}>{getWeatherEmoji(selectedRecord.weatherType)}</span>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--adaptive-grey-900, #191f28)' }}>
                    오늘의 날씨: {getWeatherLabel(selectedRecord.weatherType)}
                  </div>
                </div>
              </div>

              {/* 일기 내용 */}
              {selectedRecord.diary ? (
                <div style={{ background: 'var(--adaptive-grey-50, #f7f7f7)', borderRadius: '12px', padding: '16px' }}>
                  {selectedRecord.diary.type === 'free' ? (
                    <>
                      <div style={{ fontSize: '14px', color: 'var(--adaptive-grey-600, #6b7684)', marginBottom: '8px' }}>자유 일기</div>
                      <div style={{ fontSize: '15px', color: 'var(--adaptive-grey-900, #191f28)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {selectedRecord.diary.content || '(내용 없음)'}
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '14px', color: 'var(--adaptive-grey-600, #6b7684)', marginBottom: '12px' }}>질문 따라가기</div>
                      {selectedRecord.diary.answers.map((qa, idx) => (
                        <div key={idx} style={{ marginBottom: idx < selectedRecord.diary!.answers.length - 1 ? '16px' : 0 }}>
                          <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--adaptive-blue-500, #3182f6)', marginBottom: '4px' }}>
                            Q. {qa.question}
                          </div>
                          <div style={{ fontSize: '15px', color: 'var(--adaptive-grey-900, #191f28)', lineHeight: 1.6 }}>
                            {qa.answer || '(답변 없음)'}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ) : (
                <div style={{ background: 'var(--adaptive-grey-50, #f7f7f7)', borderRadius: '12px', padding: '16px', textAlign: 'center', color: 'var(--adaptive-grey-500, #8b95a1)' }}>
                  작성된 일기가 없어요
                </div>
              )}

              {/* 심호흡 기록 */}
              {selectedRecord.breathings && selectedRecord.breathings.length > 0 && (
                <div style={{ marginTop: '16px', fontSize: '14px', color: 'var(--adaptive-grey-600, #6b7684)' }}>
                  심호흡 {selectedRecord.breathings.length}회 완료
                </div>
              )}
            </div>
          </>
        )}
      </BottomSheet>
    </div>
  );
}
