import { HashRouter, Routes, Route } from 'react-router-dom';
import { TDSMobileProvider, PortalProvider } from '@toss/tds-mobile';
import OnboardingPage from './pages/OnboardingPage';
import MainPage from './pages/MainPage';
import BreathingPage from './pages/BreathingPage';
import DiaryPage from './pages/DiaryPage';
import GuidedDiaryPage from './pages/GuidedDiaryPage';
import CalendarPage from './pages/CalendarPage';
import SettingsPage from './pages/SettingsPage';
import TimerPage from './pages/TimerPage';
import './App.css';

function App() {
  return (
    <TDSMobileProvider
      userAgent={{
        isIOS: /iPhone|iPad/.test(navigator.userAgent),
        isAndroid: /Android/.test(navigator.userAgent),
        colorPreference: 'light',
        fontA11y: undefined,
        fontScale: 100,
      }}
      token={{
        color: {
          primary: '#3182f6',
        },
      }}
    >
      <PortalProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<OnboardingPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/breathing" element={<BreathingPage />} />
            <Route path="/diary" element={<DiaryPage />} />
            <Route path="/diary/guided" element={<GuidedDiaryPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/timer" element={<TimerPage />} />
          </Routes>
        </HashRouter>
      </PortalProvider>
    </TDSMobileProvider>
  );
}

export default App;
