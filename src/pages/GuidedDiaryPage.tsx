import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomCTA, Paragraph } from '@toss/tds-mobile';
import { GUIDED_QUESTIONS } from '../data/weather';
import { getTodayRecord, createOrUpdateTodayRecord, getSelectedWeather } from '../utils/storage';
import type { QuestionAnswer } from '../types';

export default function GuidedDiaryPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswer[]>(
    GUIDED_QUESTIONS.map((q) => ({ question: q.question, answer: '' }))
  );

  useEffect(() => {
    const todayRecord = getTodayRecord();
    if (todayRecord?.diary?.type === 'guided' && todayRecord.diary.answers.length > 0) {
      setAnswers(todayRecord.diary.answers);
    }
  }, []);

  const currentQuestion = GUIDED_QUESTIONS[currentStep];
  const isLastStep = currentStep === GUIDED_QUESTIONS.length - 1;

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = { ...newAnswers[currentStep], answer: value };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastStep) {
      handleSave();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    const weather = getSelectedWeather() || 'sunny';
    createOrUpdateTodayRecord(weather, {
      type: 'guided',
      content: '',
      answers,
    });
    navigate('/main');
  };

  return (
    <div className="full-screen" style={{ background: 'var(--adaptive-grey-50, #f7f7f7)' }}>
      <div style={{ padding: '16px 24px', background: 'white' }}>
        <Paragraph typography="t6" style={{ color: 'var(--adaptive-grey-600, #6b7684)' }}>
          {currentStep + 1} / {GUIDED_QUESTIONS.length}
        </Paragraph>
      </div>

      <div className="guided-container" style={{ padding: '24px', flex: 1, overflow: 'auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <Paragraph typography="t6" fontWeight="semibold" style={{ color: 'var(--adaptive-blue-500, #3182f6)', marginBottom: '8px' }}>
            Q.
          </Paragraph>
          <Paragraph typography="t3" fontWeight="semibold" style={{ marginBottom: '12px', color: 'var(--adaptive-grey-900, #191f28)' }}>
            {currentQuestion.question}
          </Paragraph>
          <Paragraph typography="t6" style={{ color: 'var(--adaptive-grey-600, #6b7684)', lineHeight: 1.6 }}>
            {currentQuestion.description}
          </Paragraph>
        </div>

        <textarea
          placeholder="여기에 답변을 적어보세요..."
          value={answers[currentStep]?.answer || ''}
          onChange={(e) => handleAnswerChange(e.target.value)}
          autoFocus
          style={{
            width: '100%',
            height: '200px',
            padding: '16px',
            fontSize: '15px',
            lineHeight: '1.6',
            border: 'none',
            borderRadius: '12px',
            background: 'white',
            resize: 'none',
            color: 'var(--adaptive-grey-900, #191f28)',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', padding: '16px', background: 'white' }}>
        {currentStep > 0 && (
          <BottomCTA color="light" onClick={handlePrev} style={{ flex: 1 }}>
            이전
          </BottomCTA>
        )}
        <BottomCTA onClick={handleNext} style={{ flex: 1 }}>
          {isLastStep ? '완료' : '다음'}
        </BottomCTA>
      </div>
    </div>
  );
}
