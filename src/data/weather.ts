import type { WeatherInfo, WeatherType } from '../types';

// 날씨(감정) 데이터 - 7개
// Lottie main.json 파일 기준 프레임 정보
export const WEATHER_DATA: Record<WeatherType, WeatherInfo> = {
  sunny: {
    id: 'sunny',
    korean: '맑음',
    emotion: '평화로운, 따뜻한',
    startFrame: 900,
    endFrame: 1831,
  },
  cloudy: {
    id: 'cloudy',
    korean: '흐림',
    emotion: '우울한, 무거운',
    startFrame: 1800,
    endFrame: 2731,
  },
  rainy: {
    id: 'rainy',
    korean: '비',
    emotion: '슬픈, 지친',
    startFrame: 2700,
    endFrame: 3631,
  },
  storm: {
    id: 'storm',
    korean: '폭풍',
    emotion: '화난, 격한',
    startFrame: 3600,
    endFrame: 5431,
  },
  sunshower: {
    id: 'sunshower',
    korean: '여우비',
    emotion: '복잡한, 묘한',
    startFrame: 5400,
    endFrame: 6343,
  },
  foggy: {
    id: 'foggy',
    korean: '안개',
    emotion: '혼란스러운, 불안한',
    startFrame: 6300,
    endFrame: 7231,
  },
  snowy: {
    id: 'snowy',
    korean: '눈',
    emotion: '차가운, 공허한',
    startFrame: 7200,
    endFrame: 8131,
  },
};

export const WEATHER_LIST = Object.values(WEATHER_DATA);

export const getWeatherInfo = (type: WeatherType): WeatherInfo => {
  return WEATHER_DATA[type];
};

// 질문따라가기 질문 목록
export const GUIDED_QUESTIONS = [
  {
    id: 1,
    question: '무슨 일이 있었나요?',
    description: '누구와, 언제, 어디서, 무슨 일이 있었는지 마치 그때로 돌아간 것처럼 자세히 묘사해볼까요?',
  },
  {
    id: 2,
    question: '그때 나는 어떻게 행동했나요?',
    description: '손이 떨리거나 식은땀이 나거나 나의 몸에 어떤 변화가 있었는지도 적어보아요.',
  },
  {
    id: 3,
    question: '기분을 깊이 들여다볼까요?',
    description: '베풀어준 것에 대한 고마움, 안정감이나 어딘가 대한 뿌듯함 혹은 그렇지 못한 서운함, 불확실한 미래에서 오는 두려움, 내 잘못이 아니라는 억울함, 상대에 대한 질투심 등 많은 감정들이 있을 거예요. 떠오르는 감정들을 자유롭게 표현해보세요.',
  },
];
