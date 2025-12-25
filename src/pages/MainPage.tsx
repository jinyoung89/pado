import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomSheet, ListRow } from '@toss/tds-mobile';
import { WEATHER_LIST } from '../data/weather';
import type { WeatherType } from '../types';
import { getSelectedWeather, setSelectedWeather, createOrUpdateTodayRecord } from '../utils/storage';

// Lottie 파일들 import
import basic from '../assets/lottie/01Basic2.json';
import sunny from '../assets/lottie/02Sunny 2.json';
import cloudy from '../assets/lottie/03Cloudy 2.json';
import rainy from '../assets/lottie/04Rain 2.json';
import storm from '../assets/lottie/05Thunderstorm 2.json';
import sunshower from '../assets/lottie/06Sunshower 2.json';
import foggy from '../assets/lottie/07Fog 2.json';
import snowy from '../assets/lottie/08Snow 2.json';
import fire from '../assets/lottie/09Fire 2.json';
import sunset from '../assets/lottie/10Sunset 2.json';
import night from '../assets/lottie/11Night 2.json';
import sunrise from '../assets/lottie/12Sunrise 2.json';

const LOTTIE_FILES: Record<WeatherType, object> = {
  basic,
  sunny,
  cloudy,
  rainy,
  storm,
  sunshower,
  foggy,
  snowy,
  fire,
  sunset,
  night,
  sunrise,
};

export default function MainPage() {
  const navigate = useNavigate();
  const [selectedWeatherState, setSelectedWeatherState] = useState<WeatherType>(
    getSelectedWeather() || 'basic'
  );
  const [isWeatherSheetOpen, setIsWeatherSheetOpen] = useState(false);
  const [isMenuSheetOpen, setIsMenuSheetOpen] = useState(false);
  const [isDiarySelectOpen, setIsDiarySelectOpen] = useState(false);

  // history 상태 추적
  const hasSheetHistoryRef = useRef(false);
  const hasBaseHistoryRef = useRef(false);

  // 바텀시트가 열려있는지 확인
  const isAnySheetOpen = isWeatherSheetOpen || isMenuSheetOpen || isDiarySelectOpen;

  // 메인 페이지 진입 시 base history 추가 (백 버튼용)
  useEffect(() => {
    if (!hasBaseHistoryRef.current) {
      window.history.pushState({ type: 'mainBase' }, '');
      hasBaseHistoryRef.current = true;
    }
  }, []);

  // 바텀시트 열기 (history state 추가)
  const openSheet = useCallback((setter: (v: boolean) => void) => {
    if (!hasSheetHistoryRef.current) {
      window.history.pushState({ type: 'sheet' }, '');
      hasSheetHistoryRef.current = true;
    }
    setter(true);
  }, []);

  // 바텀시트 닫기 (history 정리)
  const closeAllSheets = useCallback((skipHistoryBack = false) => {
    setIsWeatherSheetOpen(false);
    setIsMenuSheetOpen(false);
    setIsDiarySelectOpen(false);

    if (hasSheetHistoryRef.current) {
      if (skipHistoryBack) {
        // 페이지 이동 시: history.back() 안 하고 ref만 정리
        hasSheetHistoryRef.current = false;
      } else {
        // 일반 닫기: history.back() 호출 (popstate에서 ref 정리됨)
        window.history.back();
      }
    }
  }, []);

  // 백버튼 핸들러
  useEffect(() => {
    const handlePopState = () => {
      if (hasSheetHistoryRef.current) {
        // 시트 히스토리가 pop됨 → 시트 닫기
        hasSheetHistoryRef.current = false;
        setIsWeatherSheetOpen(false);
        setIsMenuSheetOpen(false);
        setIsDiarySelectOpen(false);
      } else if (hasBaseHistoryRef.current) {
        // base 히스토리가 pop됨 → 온보딩으로
        hasBaseHistoryRef.current = false;
        navigate('/', { replace: true });
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  // TDS BottomSheet의 onDimmerClick 핸들러
  const closeSheet = useCallback(() => {
    closeAllSheets();
  }, [closeAllSheets]);

  const handleWeatherSelect = (weather: WeatherType) => {
    setSelectedWeatherState(weather);
    setSelectedWeather(weather);
    createOrUpdateTodayRecord(weather);
    closeAllSheets();
  };

  const getWeatherEmoji = (weather: string) => {
    const emojis: Record<string, string> = {
      basic: '🌊',
      sunny: '☀️',
      cloudy: '☁️',
      rainy: '🌧️',
      storm: '⛈️',
      sunshower: '🌦️',
      foggy: '🌫️',
      snowy: '❄️',
      fire: '🔥',
      sunset: '🌅',
      night: '🌙',
      sunrise: '🌄',
    };
    return emojis[weather] || '🌊';
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
        <AnimatePresence>
          <motion.div
            key={selectedWeatherState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          >
            <Lottie
              animationData={LOTTIE_FILES[selectedWeatherState]}
              loop={true}
              autoplay={true}
              rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
              style={{ width: '100%', height: '100%' }}
            />
          </motion.div>
        </AnimatePresence>
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
                className={`weather-item ${selectedWeatherState === weather.id ? 'selected' : ''}`}
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
            onClick={() => { closeAllSheets(true); navigate('/diary'); }}
            left={<span style={{ fontSize: '24px', fontFamily: 'Tossface' }}>✏️</span>}
            contents={<ListRow.Texts type="2RowTypeA" top="자유롭게 적기" bottom="내 마음을 자유롭게 기록해요" />}
            withArrow
            withTouchEffect
            verticalPadding="large"
          />
          <ListRow
            onClick={() => { closeAllSheets(true); navigate('/diary/guided'); }}
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
            onClick={() => { closeAllSheets(true); navigate('/calendar'); }}
            left={<span style={{ fontSize: '24px', fontFamily: 'Tossface' }}>📅</span>}
            contents={<ListRow.Texts type="2RowTypeA" top="캘린더" bottom="지난 기록을 돌아봐요" />}
            withArrow
            withTouchEffect
            verticalPadding="large"
          />
          <ListRow
            onClick={() => { closeAllSheets(true); navigate('/timer'); }}
            left={<span style={{ fontSize: '24px', fontFamily: 'Tossface' }}>⏰</span>}
            contents={<ListRow.Texts type="2RowTypeA" top="예약종료" bottom="타이머를 설정해요" />}
            withArrow
            withTouchEffect
            verticalPadding="large"
          />
          <ListRow
            onClick={() => { closeAllSheets(true); navigate('/settings'); }}
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
