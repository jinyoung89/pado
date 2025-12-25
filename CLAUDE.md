# PA:DO 프로젝트 가이드라인

## Git 커밋 규칙
- **커밋 메시지는 한글로 작성**
- 예시: "기능: 날씨 전환 애니메이션 추가", "수정: 백버튼 동작 오류 해결"

## 필수!! 토스 미니앱 가이드라인
**꼭 토스의 가이드라인을 따라야 합니다. 절대로 이 규칙을 무시하지 마세요.**

### 참고 문서
1. **기본 문서 (권장)** - 앱인토스 핵심 정보
   https://developers-apps-in-toss.toss.im/llms.txt

2. **전체 문서 (Full)** - 모든 기능 포함
   https://developers-apps-in-toss.toss.im/llms-full.txt

3. **예제 전용 문서** - 예제 코드 참고용
   https://developers-apps-in-toss.toss.im/tutorials/examples.md

4. **TDS 문서 (WebView)** - TDS WebView 컴포넌트
   https://tossmini-docs.toss.im/tds-mobile/llms-full.txt

5. **TDS 문서 (React Native)** - TDS RN 컴포넌트
   https://tossmini-docs.toss.im/tds-react-native/llms-full.txt

## 디자인 규칙
- **반드시 TDS (토스 디자인 시스템) 컴포넌트 사용**
- TDS 문서: https://tossmini-docs.toss.im/tds-mobile/llms-full.txt
- 커스텀 컴포넌트보다 TDS 컴포넌트 우선 사용
- ListRow는 props 기반 (`contents`, `left`, `right`) - children 패턴 사용 금지

## 주요 TDS 컴포넌트 사용법
```tsx
// ListRow - 올바른 사용법
<ListRow
  left={<span style={{ fontFamily: 'Tossface' }}>✏️</span>}
  contents={<ListRow.Texts type="2RowTypeA" top="제목" bottom="설명" />}
  withArrow
  withTouchEffect
  verticalPadding="large"
/>

// BottomSheet
<BottomSheet open={isOpen} onDimmerClick={onClose}>
  <BottomSheet.Header>제목</BottomSheet.Header>
  {/* 내용 */}
</BottomSheet>
```

## 프로젝트 구조
- Granite (Toss 미니앱 프레임워크) 사용
- React + TypeScript + Vite
- 빌드: `npx granite build`
- 개발: `npx granite dev`

## 폰트
- Tossface 폰트 사용 (이모지 아이콘)
- src/index.css에 @font-face 정의됨
