import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import type { LottieRefCurrentProps } from 'lottie-react';
import { BottomSheet, ListRow } from '@toss/tds-mobile';
import { WEATHER_LIST, WEATHER_DATA } from '../data/weather';
import type { WeatherType } from '../types';
import { getSelectedWeather, setSelectedWeather, createOrUpdateTodayRecord } from '../utils/storage';
import mainAnimation from '../assets/lottie/main.json';

export default function MainPage() {
  const navigate = useNavigate();
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [selectedWeather, setSelectedWeatherState] = useState<WeatherType>(
    getSelectedWeather() || 'sunny'
  );
  const [isWeatherSheetOpen, setIsWeatherSheetOpen] = useState(false);
  const [isMenuSheetOpen, setIsMenuSheetOpen] = useState(false);
  const [isDiarySelectOpen, setIsDiarySelectOpen] = useState(false);

  // 바텀시트가 열려있는지 확인
  const isAnySheetOpen = isWeatherSheetOpen || isMenuSheetOpen || isDiarySelectOpen;

  // 바텀시트 열기 (history state 추가)
  const openSheet = useCallback((setter: (v: boolean) => void) => {
    window.history.pushState({ sheet: true }, '');
    setter(true);
  }, []);

  // 바텀시트 닫기
  const closeAllSheets = useCallback(() => {
    setIsWeatherSheetOpen(false);
    setIsMenuSheetOpen(false);
    setIsDiarySelectOpen(false);
  }, []);

  // 백버튼 핸들러
  useEffect(() => {
    const handlePopState = () => {
      if (isAnySheetOpen) {
        closeAllSheets();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAnySheetOpen, closeAllSheets]);

  // TDS BottomSheet의 onClose 핸들러 (history back 포함)
  const closeSheet = useCallback(() => {
    if (isAnySheetOpen) {
      window.history.back();
    }
  }, [isAnySheetOpen]);

  useEffect(() => {
    if (lottieRef.current) {
      const weatherInfo = WEATHER_DATA[selectedWeather];
      lottieRef.current.goToAndPlay(weatherInfo.startFrame, true);
    }
  }, [selectedWeather]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lottieRef.current) {
        const weatherInfo = WEATHER_DATA[selectedWeather];
        const currentFrame = lottieRef.current.animationItem?.currentFrame || 0;
        if (currentFrame >= weatherInfo.endFrame) {
          lottieRef.current.goToAndPlay(weatherInfo.startFrame, true);
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [selectedWeather]);

  const handleWeatherSelect = (weather: WeatherType) => {
    setSelectedWeatherState(weather);
    setSelectedWeather(weather);
    createOrUpdateTodayRecord(weather);
    setIsWeatherSheetOpen(false);
  };

  const getWeatherEmoji = (weather: string) => {
    const emojis: Record<string, string> = {
      sunny: '☀️', cloudy: '☁️', rainy: '🌧️', storm: '⛈️',
      sunshower: '🌦️', foggy: '🌫️', snowy: '❄️',
    };
    return emojis[weather] || '☀️';
  };

  // 배경 클릭시 날씨 시트 열기 (다른 시트가 열려있지 않을 때만)
  const handleBackgroundClick = useCallback(() => {
    if (!isAnySheetOpen) {
      openSheet(setIsWeatherSheetOpen);
    }
  }, [isAnySheetOpen, openSheet]);

  return (
    <div className="full-screen" onClick={handleBackgroundClick}>
      <div className="main-background">
        <Lottie
          lottieRef={lottieRef}
          animationData={mainAnimation}
          loop={false}
          autoplay={true}
          rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
        <div style={{ position: 'absolute', bottom: '120px', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>
            화면을 터치해서 오늘의 날씨를 선택하세요
          </p>
        </div>
      </div>

      <div className="bottom-actions" onClick={(e) => e.stopPropagation()}>
        <button className="action-btn" onClick={() => navigate('/breathing')}>
          <span className="action-icon">🎵</span>
          <span className="action-label">심호흡</span>
        </button>
        <button className="action-btn" onClick={() => openSheet(setIsDiarySelectOpen)}>
          <span className="action-icon">✏️</span>
          <span className="action-label">기록</span>
        </button>
        <button className="action-btn" onClick={() => openSheet(setIsMenuSheetOpen)}>
          <span className="action-icon">☰</span>
          <span className="action-label">메뉴</span>
        </button>
      </div>

      {/* 날씨 선택 시트 */}
      <BottomSheet open={isWeatherSheetOpen} onDimmerClick={closeSheet}>
        <BottomSheet.Header>오늘 너의 하루는 어땠어?</BottomSheet.Header>
        <div style={{ padding: '16px 20px 24px' }}>
          <div className="weather-grid">
            {WEATHER_LIST.map((weather) => (
              <button
                key={weather.id}
                className={`weather-item ${selectedWeather === weather.id ? 'selected' : ''}`}
                onClick={() => handleWeatherSelect(weather.id)}
              >
                <span style={{ fontSize: '32px' }}>{getWeatherEmoji(weather.id)}</span>
                <span className="weather-item-label">{weather.korean}</span>
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>

      {/* 일기 선택 시트 */}
      <BottomSheet open={isDiarySelectOpen} onDimmerClick={closeSheet}>
        <BottomSheet.Header>감정 정리하기</BottomSheet.Header>
        <div style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <ListRow
            onClick={() => { closeAllSheets(); navigate('/diary'); }}
            left={<span style={{ fontSize: '24px', fontFamily: 'Tossface' }}>✏️</span>}
            contents={<ListRow.Texts type="2RowTypeA" top="자유롭게 적기" bottom="내 마음을 자유롭게 기록해요" />}
            withArrow
            withTouchEffect
            verticalPadding="large"
          />
          <ListRow
            onClick={() => { closeAllSheets(); navigate('/diary/guided'); }}
            left={<span style={{ fontSize: '24px', fontFamily: 'Tossface' }}>💬</span>}
            contents={<ListRow.Texts type="2RowTypeA" top="질문 따라가기" bottom="질문에 답하며 마음을 정리해요" />}
            withArrow
            withTouchEffect
            verticalPadding="large"
            border="none"
          />
        </div>
      </BottomSheet>

      {/* 메뉴 시트 */}
      <BottomSheet open={isMenuSheetOpen} onDimmerClick={closeSheet}>
        <BottomSheet.Header>메뉴</BottomSheet.Header>
        <div style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <ListRow
            onClick={() => { closeAllSheets(); navigate('/calendar'); }}
            left={<span style={{ fontSize: '24px', fontFamily: 'Tossface' }}>📅</span>}
            contents={<ListRow.Texts type="2RowTypeA" top="캘린더" bottom="지난 기록을 돌아봐요" />}
            withArrow
            withTouchEffect
            verticalPadding="large"
          />
          <ListRow
            onClick={() => { closeAllSheets(); navigate('/timer'); }}
            left={<span style={{ fontSize: '24px', fontFamily: 'Tossface' }}>⏰</span>}
            contents={<ListRow.Texts type="2RowTypeA" top="예약종료" bottom="타이머를 설정해요" />}
            withArrow
            withTouchEffect
            verticalPadding="large"
          />
          <ListRow
            onClick={() => { closeAllSheets(); navigate('/settings'); }}
            left={<span style={{ fontSize: '24px', fontFamily: 'Tossface' }}>⚙️</span>}
            contents={<ListRow.Texts type="2RowTypeA" top="설정" bottom="앱 설정을 변경해요" />}
            withArrow
            withTouchEffect
            verticalPadding="large"
            border="none"
          />
        </div>
      </BottomSheet>
    </div>
  );
}
