import type { Settings, DayRecord, WeatherType } from '../types';
import { STORAGE_KEYS } from '../types';

// 기본 설정값
const DEFAULT_SETTINGS: Settings = {
  notificationEnabled: true,
};

// 설정 관련
export const getSettings = (): Settings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to get settings:', e);
  }
  return DEFAULT_SETTINGS;
};

export const saveSettings = (settings: Partial<Settings>): void => {
  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
};

// 기록 관련
export const getAllRecords = (): Record<string, DayRecord> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to get records:', e);
  }
  return {};
};

export const getRecord = (date: string): DayRecord | null => {
  const records = getAllRecords();
  return records[date] || null;
};

export const getTodayRecord = (): DayRecord | null => {
  const today = new Date().toISOString().split('T')[0];
  return getRecord(today);
};

export const saveRecord = (record: DayRecord): void => {
  try {
    const records = getAllRecords();
    records[record.date] = {
      ...record,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save record:', e);
  }
};

export const createOrUpdateTodayRecord = (
  weatherType: WeatherType,
  diary?: DayRecord['diary'],
  breathing?: DayRecord['breathings'][0]
): DayRecord => {
  const today = new Date().toISOString().split('T')[0];
  const existing = getTodayRecord();
  const now = new Date().toISOString();

  const record: DayRecord = {
    date: today,
    weatherType: weatherType,
    diary: diary ?? existing?.diary ?? null,
    breathings: existing?.breathings ?? [],
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  if (breathing) {
    record.breathings.push(breathing);
  }

  saveRecord(record);
  return record;
};

// 선택된 날씨 (현재 세션용)
export const getSelectedWeather = (): WeatherType | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_WEATHER);
    return stored as WeatherType | null;
  } catch (e) {
    return null;
  }
};

export const setSelectedWeather = (weather: WeatherType): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_WEATHER, weather);
  } catch (e) {
    console.error('Failed to save selected weather:', e);
  }
};

// 날짜 유틸리티
export const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getMonthRecords = (year: number, month: number): DayRecord[] => {
  const records = getAllRecords();
  const prefix = `${year}-${String(month).padStart(2, '0')}`;

  return Object.values(records)
    .filter(r => r.date.startsWith(prefix))
    .sort((a, b) => a.date.localeCompare(b.date));
};

// 모든 기록 초기화
export const clearAllRecords = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_WEATHER);
  } catch (e) {
    console.error('Failed to clear records:', e);
  }
};
