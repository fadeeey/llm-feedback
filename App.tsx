
import React, { useState, useCallback } from 'react';
import SurveyCreation from './components/SurveyCreation';
import FeedbackForm from './components/FeedbackForm';
import ReportView from './components/ReportView';
import type { Survey } from './types';
import { SparklesIcon } from './components/common/Icons';

type AppState = 'creating_survey' | 'collecting_feedback' | 'viewing_report';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('creating_survey');
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [feedbackList, setFeedbackList] = useState<string[]>([]);

  const handleSurveyCreated = useCallback((createdSurvey: Survey) => {
    setSurvey(createdSurvey);
    setFeedbackList([]);
    setAppState('collecting_feedback');
  }, []);

  const handleFeedbackSubmitted = useCallback((feedback: string) => {
    setFeedbackList(prev => [...prev, feedback]);
  }, []);

  const handleGenerateReport = useCallback(() => {
    if (feedbackList.length > 0) {
      setAppState('viewing_report');
    } else {
      alert("Please submit at least one piece of feedback before generating a report.");
    }
  }, [feedbackList]);
  
  const handleStartNew = useCallback(() => {
    setSurvey(null);
    setFeedbackList([]);
    setAppState('creating_survey');
  }, []);

  const renderContent = () => {
    switch (appState) {
      case 'creating_survey':
        return <SurveyCreation onSurveyCreated={handleSurveyCreated} />;
      case 'collecting_feedback':
        if (!survey) return null;
        return (
          <FeedbackForm
            survey={survey}
            feedbackList={feedbackList}
            onFeedbackSubmitted={handleFeedbackSubmitted}
            onGenerateReport={handleGenerateReport}
          />
        );
      case 'viewing_report':
        if (!survey) return null;
        return <ReportView survey={survey} feedbackList={feedbackList} onStartNew={handleStartNew} />;
      default:
        return <SurveyCreation onSurveyCreated={handleSurveyCreated} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <header className="bg-white dark:bg-slate-800/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="w-8 h-8 text-indigo-500" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Corporate Feedback AI Analyzer</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Leveraging Gemini to generate insightful employee feedback reports.
          </p>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      <footer className="text-center py-4 text-xs text-slate-400 dark:text-slate-500">
        <p>Built with React, TypeScript, Tailwind CSS, and the Google Gemini API.</p>
      </footer>
    </div>
  );
};

export default App;
