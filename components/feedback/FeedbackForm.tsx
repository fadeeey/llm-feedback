import React, { useState, useEffect } from 'react';
import type { Survey } from '../../types';
import Card from '../common/Card';
import { ClipboardDocumentCheckIcon, ClipboardDocumentIcon } from '../common/Icons';

interface FeedbackFormProps {
  survey: Survey;
  onFeedbackSubmitted: (feedback: string) => void;
  onGenerateReport: () => void;
  onStartNew: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ survey, onFeedbackSubmitted, onGenerateReport, onStartNew }) => {
  const [feedback, setFeedback] = useState('');
  const [surveyLink, setSurveyLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSurveyLink(`${window.location.origin}${window.location.pathname}#survey/${survey.id}`);
  }, [survey.id]);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(surveyLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      onFeedbackSubmitted(feedback.trim());
      setFeedback('');
    }
  };

  const feedbackList = survey.feedback || [];

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Опрос создан!</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Поделитесь этой ссылкой с коллегами, чтобы собрать отзывы для <span className="font-bold">{survey.employeeName}</span>.
            </p>
            <div className="mt-4 flex rounded-md shadow-sm">
                <input
                    type="text"
                    readOnly
                    value={surveyLink}
                    className="block w-full flex-1 rounded-none rounded-l-md border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800 px-3 py-2 sm:text-sm"
                />
                <button
                    onClick={handleCopyLink}
                    type="button"
                    className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    {copied ? <ClipboardDocumentCheckIcon className="h-5 w-5 text-green-500" /> : <ClipboardDocumentIcon className="h-5 w-5" />}
                    <span>{copied ? 'Скопировано!' : 'Копировать'}</span>
                </button>
            </div>
        </div>
      </Card>
      
      <Card>
        <div className="p-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Оставить отзыв для {survey.employeeName}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Ваш отзыв анонимен. Пожалуйста, будьте конструктивны и конкретны.
            </p>
            <form onSubmit={handleSubmit} className="mt-4">
                <textarea
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="block w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Оставьте свой отзыв здесь..."
                />
                <button
                    type="submit"
                    disabled={!feedback.trim()}
                    className="mt-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/50 disabled:cursor-not-allowed"
                >
                    Отправить отзыв
                </button>
            </form>
        </div>
      </Card>

      <Card>
        <div className="p-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Собранные отзывы ({feedbackList.length})</h3>
             {feedbackList.length > 0 ? (
                 <ul className="mt-4 space-y-3 max-h-60 overflow-y-auto rounded-md p-2 bg-slate-50 dark:bg-slate-900/50 no-scrollbar">
                    {feedbackList.map((item, index) => (
                        <li key={index} className="rounded-md bg-white dark:bg-slate-800 p-3 text-sm text-slate-700 dark:text-slate-300 shadow-sm">
                            "{item}"
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Отзывов пока нет. Поделитесь ссылкой выше, чтобы начать.</p>
            )}
             <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6 flex justify-between items-center gap-4">
                <button
                  onClick={onStartNew}
                  className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  ← Начать новый опрос
                </button>
                <button
                    onClick={onGenerateReport}
                    disabled={feedbackList.length === 0}
                    className="inline-flex items-center gap-2 justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-400 dark:disabled:bg-green-500/50 disabled:cursor-not-allowed"
                >
                    Создать AI-отчет
                </button>
             </div>
        </div>
      </Card>
    </div>
  );
};

export default FeedbackForm;