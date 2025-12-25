import { useNavigate } from 'react-router-dom';
import { Paragraph } from '@toss/tds-mobile';
import iconImage from '../assets/icon.png';

export default function OnboardingPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/main');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'white',
    }}>
      {/* 상단 컨텐츠 영역 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 24px',
        paddingTop: 'env(safe-area-inset-top)',
      }}>
        {/* 앱 아이콘 */}
        <img
          src={iconImage}
          alt="PA:DO"
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '24px',
            marginBottom: '40px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          }}
        />

        {/* 타이틀 */}
        <Paragraph typography="t2" fontWeight="bold" style={{
          textAlign: 'center',
          marginBottom: '16px',
          color: 'var(--adaptive-grey-900, #191f28)',
        }}>
          오늘 하루는 어땠나요?
        </Paragraph>

        {/* 설명 */}
        <Paragraph typography="t5" style={{
          textAlign: 'center',
          color: 'var(--adaptive-grey-600, #6b7684)',
          lineHeight: 1.6,
        }}>
          날씨로 감정을 기록하고{'\n'}
          파도 소리와 함께 마음을 정리해요
        </Paragraph>
      </div>

      {/* 하단 CTA */}
      <div style={{ padding: '16px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
        <button
          onClick={handleStart}
          style={{
            width: '100%',
            padding: '16px',
            background: '#3182f6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '17px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
