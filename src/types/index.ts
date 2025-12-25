// 날씨(감정) 타입 - 7개
export type WeatherType =
  | 'sunny'      // 맑음
  | 'cloudy'     // 흐림
  | 'rainy'      // 비
  | 'storm'      // 폭풍
  | 'sunshower'  // 여우비
  | 'foggy'      // 안개
  | 'snowy';     // 눈

// 날씨 정보
export interface WeatherInfo {
  id: WeatherType;
  korean: string;
  emotion: string;
  startFrame: number;
  endFrame: number;
}

// 일기 타입
export type DiaryType = 'free' | 'guided';

// 질문 답변
export interface QuestionAnswer {
  question: string;
  answer: string;
}

// 일기 데이터
export interface DiaryData {
  type: DiaryType;
  content: string;          // 자유롭게 적기 내용
  answers: QuestionAnswer[]; // 질문따라가기 답변
}

// 심호흡 기록
export interface BreathingRecord {
  duration: number;         // 소요 시간 (초)
  completedAt: string;      // ISO date string
}

// 하루 기록
export interface DayRecord {
  date: string;             // YYYY-MM-DD
  weatherType: WeatherType;
  diary: DiaryData | null;
  breathings: BreathingRecord[];
  createdAt: string;
  updatedAt: string;
}

// 설정
export interface Settings {
  notificationEnabled: boolean;
}

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  SETTINGS: 'pado_settings',
  RECORDS: 'pado_records',
  SELECTED_WEATHER: 'pado_selected_weather',
} as const;
