import { Howl } from 'howler';
import type { WeatherType } from '../types';

// BGM 파일 매핑 (public 폴더)
const BGM_FILES: Record<WeatherType, string> = {
  basic: '/audio/bgm/BgmBasic.mp3',
  sunny: '/audio/bgm/BgmSunny.mp3',
  cloudy: '/audio/bgm/BgmCloudy.mp3',
  rainy: '/audio/bgm/BgmRain.mp3',
  storm: '/audio/bgm/BgmThunderstorm.mp3',
  sunshower: '/audio/bgm/BgmSunshower.mp3',
  foggy: '/audio/bgm/BgmFog.mp3',
  snowy: '/audio/bgm/BgmSnow.mp3',
  fire: '/audio/bgm/BgmFire.mp3',
  sunset: '/audio/bgm/BgmSunset.mp3',
  night: '/audio/bgm/BgmNight.mp3',
  sunrise: '/audio/bgm/BgmSunrise.mp3',
};

// SFX 파일 매핑 (flac - iOS에서 안될 수 있음)
const SFX_FILES: Record<WeatherType, string> = {
  basic: '/audio/sfx/basic.flac',
  sunny: '/audio/sfx/sunny.flac',
  cloudy: '/audio/sfx/cloudy.flac',
  rainy: '/audio/sfx/rain.flac',
  storm: '/audio/sfx/thunderstorm.flac',
  sunshower: '/audio/sfx/sunshower.flac',
  foggy: '/audio/sfx/fog.flac',
  snowy: '/audio/sfx/snowing.flac',
  fire: '/audio/sfx/fire.flac',
  sunset: '/audio/sfx/sunset.flac',
  night: '/audio/sfx/night.flac',
  sunrise: '/audio/sfx/sunrise.flac',
};

class AudioManager {
  private bgm: Howl | null = null;
  private sfx: Howl | null = null;
  private currentWeather: WeatherType | null = null;
  private bgmVolume = 0.5;
  private sfxVolume = 0.3;
  private isPlaying = false;

  // 오디오 시작 (사용자 인터랙션 후 호출)
  play(weather: WeatherType) {
    if (this.currentWeather === weather && this.isPlaying) {
      return; // 이미 같은 날씨 재생 중
    }

    this.stop();
    this.currentWeather = weather;

    // BGM 재생
    this.bgm = new Howl({
      src: [BGM_FILES[weather]],
      loop: true,
      volume: this.bgmVolume,
      onloaderror: (_id, error) => {
        console.warn('BGM 로드 실패:', error);
      },
    });
    this.bgm.play();

    // SFX 재생
    this.sfx = new Howl({
      src: [SFX_FILES[weather]],
      loop: true,
      volume: this.sfxVolume,
      onloaderror: (_id, error) => {
        console.warn('SFX 로드 실패 (flac 미지원일 수 있음):', error);
      },
    });
    this.sfx.play();

    this.isPlaying = true;
  }

  // 날씨 변경
  changeWeather(weather: WeatherType) {
    if (this.isPlaying) {
      this.play(weather);
    } else {
      this.currentWeather = weather;
    }
  }

  // 정지
  stop() {
    if (this.bgm) {
      this.bgm.stop();
      this.bgm.unload();
      this.bgm = null;
    }
    if (this.sfx) {
      this.sfx.stop();
      this.sfx.unload();
      this.sfx = null;
    }
    this.isPlaying = false;
  }

  // 일시정지
  pause() {
    this.bgm?.pause();
    this.sfx?.pause();
    this.isPlaying = false;
  }

  // 재개
  resume() {
    if (this.currentWeather) {
      this.bgm?.play();
      this.sfx?.play();
      this.isPlaying = true;
    }
  }

  // BGM 볼륨 설정
  setBgmVolume(volume: number) {
    this.bgmVolume = volume;
    this.bgm?.volume(volume);
  }

  // SFX 볼륨 설정
  setSfxVolume(volume: number) {
    this.sfxVolume = volume;
    this.sfx?.volume(volume);
  }

  // 현재 재생 중인지
  getIsPlaying() {
    return this.isPlaying;
  }
}

export const audioManager = new AudioManager();
