import React, { useState } from 'react';
import type { Survey } from '../../types';
import Card from '../common/Card';
import { CheckCircleIcon } from '../common/Icons';

interface PublicFeedbackViewProps {
  survey: Survey;
  onSubmit: (surveyId: string, feedback: string) => void;
}

const PublicFeedbackView: React.FC<PublicFeedbackViewProps> = ({ survey, onSubmit }) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      onSubmit(survey.id, feedback.trim());
      setFeedback('');
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-lg mx-auto mt-10">
        <Card>
          <div className="p-8 text-center">
            <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto" />
            <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Спасибо!</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Ваш отзыв был успешно отправлен.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card>
        <div className="p-8">
          <h2 className="text-xl font-semibold text-center text-slate-900 dark:text-white">Оставить отзыв для {survey.employeeName}</h2>
          <p className="mt-2 text-sm text-center text-slate-600 dark:text-slate-400">
            Ваш отзыв анонимен. Пожалуйста, будьте конструктивны и конкретны.
          </p>
          <form onSubmit={handleSubmit} className="mt-6">
            <textarea
              rows={5}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="block w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Оставьте свой отзыв здесь..."
              required
              autoFocus
            />
            <button
              type="submit"
              disabled={!feedback.trim()}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/50 disabled:cursor-not-allowed"
            >
              Отправить анонимный отзыв
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default PublicFeedbackView;
