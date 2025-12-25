import type { WeatherInfo, WeatherType } from '../types';

// 날씨(감정) 데이터 - 12개
// 개별 Lottie JSON 파일 사용
export const WEATHER_DATA: Record<WeatherType, WeatherInfo> = {
  basic: {
    id: 'basic',
    korean: '잔잔',
    emotion: '평온한, 일상적인',
    lottieFile: '01Basic2.json',
  },
  sunny: {
    id: 'sunny',
    korean: '맑음',
    emotion: '평화로운, 따뜻한',
    lottieFile: '02Sunny 2.json',
  },
  cloudy: {
    id: 'cloudy',
    korean: '흐림',
    emotion: '우울한, 무거운',
    lottieFile: '03Cloudy 2.json',
  },
  rainy: {
    id: 'rainy',
    korean: '비',
    emotion: '슬픈, 지친',
    lottieFile: '04Rain 2.json',
  },
  storm: {
    id: 'storm',
    korean: '폭풍',
    emotion: '화난, 격한',
    lottieFile: '05Thunderstorm 2.json',
  },
  sunshower: {
    id: 'sunshower',
    korean: '여우비',
    emotion: '복잡한, 묘한',
    lottieFile: '06Sunshower 2.json',
  },
  foggy: {
    id: 'foggy',
    korean: '안개',
    emotion: '혼란스러운, 불안한',
    lottieFile: '07Fog 2.json',
  },
  snowy: {
    id: 'snowy',
    korean: '눈',
    emotion: '차가운, 공허한',
    lottieFile: '08Snow 2.json',
  },
  fire: {
    id: 'fire',
    korean: '불꽃',
    emotion: '열정적인, 뜨거운',
    lottieFile: '09Fire 2.json',
  },
  sunset: {
    id: 'sunset',
    korean: '노을',
    emotion: '아쉬운, 감성적인',
    lottieFile: '10Sunset 2.json',
  },
  night: {
    id: 'night',
    korean: '밤',
    emotion: '고요한, 잔잔한',
    lottieFile: '11Night 2.json',
  },
  sunrise: {
    id: 'sunrise',
    korean: '새벽',
    emotion: '희망찬, 새로운',
    lottieFile: '12Sunrise 2.json',
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
