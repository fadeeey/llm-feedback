import React, { useState, useCallback, useEffect } from 'react';
import SurveyCreation from './components/feedback/SurveyCreation';
import FeedbackForm from './components/feedback/FeedbackForm';
import ReportView from './components/feedback/ReportView';
import AuthScreen from './components/auth/AuthScreen';
import PublicFeedbackView from './components/feedback/PublicFeedbackView';
import SurveyNotFound from './components/feedback/SurveyNotFound';
import type { Survey, User } from './types';
import { SparklesIcon, MoonIcon, SunIcon, ArrowRightOnRectangleIcon } from './components/common/Icons';

type AppState = 'creating_survey' | 'collecting_feedback' | 'viewing_report';
type Theme = 'light' | 'dark';
export type LoginResult = 'success' | 'not_found' | 'wrong_password';


// Custom hook to manage state with localStorage persistence
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}


const App: React.FC = () => {
  const [appState, setAppState] = useLocalStorage<AppState>('app_state', 'creating_survey');
  const [surveys, setSurveys] = useLocalStorage<Survey[]>('surveys', []);
  const [activeSurveyId, setActiveSurveyId] = useLocalStorage<string | null>('active_survey_id', null);
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');
  const [users, setUsers] = useLocalStorage<User[]>('app_users', []);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('current_user', null);
  const [locationHash, setLocationHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
        setLocationHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
        window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleLogin = useCallback((email: string, password: string): LoginResult => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return 'not_found';
    }
    if (user.password === password) {
      setCurrentUser(user);
      return 'success';
    }
    return 'wrong_password';
  }, [users, setCurrentUser]);

  const handleRegister = useCallback((name: string, email: string, password: string): boolean => {
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return false; // Email already exists
    }
    const newUser: User = { id: `user-${Date.now()}`, name, email, password };
    setUsers(prev => [...prev, newUser]);
    return true;
  }, [users, setUsers]);


  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setActiveSurveyId(null);
    setAppState('creating_survey');
    window.location.hash = '';
  }, [setCurrentUser, setActiveSurveyId, setAppState]);

  const handleSurveyCreated = useCallback((partialSurvey: Pick<Survey, 'id' | 'employeeName' | 'createdAt'>) => {
    if (!currentUser) return;
    const newSurvey: Survey = {
        ...partialSurvey,
        createdBy: currentUser.id,
        feedback: [],
    };
    setSurveys(prev => [...prev, newSurvey]);
    setActiveSurveyId(newSurvey.id);
    setAppState('collecting_feedback');
  }, [currentUser, setSurveys, setActiveSurveyId, setAppState]);


  const handleFeedbackSubmitted = useCallback((feedback: string) => {
    if (!activeSurveyId) return;
    setSurveys(prevSurveys =>
      prevSurveys.map(s =>
        s.id === activeSurveyId
          ? { ...s, feedback: [...s.feedback, feedback] }
          : s
      )
    );
  }, [activeSurveyId, setSurveys]);
  
  const handlePublicFeedbackSubmitted = useCallback((surveyId: string, feedback: string) => {
    setSurveys(prevSurveys =>
      prevSurveys.map(s =>
        s.id === surveyId
          ? { ...s, feedback: [...s.feedback, feedback] }
          : s
      )
    );
  }, [setSurveys]);

  const handleGenerateReport = useCallback(() => {
    const activeSurvey = surveys.find(s => s.id === activeSurveyId);
    if (activeSurvey && activeSurvey.feedback.length > 0) {
      setAppState('viewing_report');
    } else {
      alert("Пожалуйста, оставьте хотя бы один отзыв перед созданием отчета.");
    }
  }, [surveys, activeSurveyId, setAppState]);
  
  const handleStartNew = useCallback(() => {
    setActiveSurveyId(null);
    setAppState('creating_survey');
  }, [setAppState, setActiveSurveyId]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  // Public view routing
  const publicSurveyIdMatch = locationHash.match(/^#survey\/(.+)$/);
  if (publicSurveyIdMatch) {
    const surveyId = publicSurveyIdMatch[1];
    const survey = surveys.find(s => s.id === surveyId);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                {survey ? (
                    <PublicFeedbackView survey={survey} onSubmit={handlePublicFeedbackSubmitted} />
                ) : (
                    <SurveyNotFound />
                )}
            </main>
        </div>
    );
  }


  const renderContent = () => {
    if (!currentUser) {
      return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />;
    }

    const activeSurvey = activeSurveyId ? surveys.find(s => s.id === activeSurveyId) : null;

    switch (appState) {
      case 'creating_survey':
        return <SurveyCreation onSurveyCreated={handleSurveyCreated} />;
      case 'collecting_feedback':
        if (!activeSurvey) return <p>Опрос не найден. <button onClick={handleStartNew} className="text-indigo-500">Начать новый.</button></p>;
        return (
          <FeedbackForm
            survey={activeSurvey}
            onFeedbackSubmitted={handleFeedbackSubmitted}
            onGenerateReport={handleGenerateReport}
            onStartNew={handleStartNew}
          />
        );
      case 'viewing_report':
        if (!activeSurvey) return <p>Опрос не найден. <button onClick={handleStartNew} className="text-indigo-500">Начать новый.</button></p>;
        return <ReportView survey={activeSurvey} onStartNew={handleStartNew} />;
      default:
        return <SurveyCreation onSurveyCreated={handleSurveyCreated} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
      <header className="bg-white dark:bg-slate-800/50 shadow-sm sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SparklesIcon className="w-8 h-8 text-indigo-500" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI-анализатор корпоративных отзывов</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 hidden sm:block">
                  Использование Gemini для создания подробных отчетов по отзывам сотрудников.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {currentUser && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:inline">
                    Привет, <span className="font-bold">{currentUser.name}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Logout"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  </button>
                </div>
              )}
               <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {renderContent()}
      </main>
      <footer className="text-center py-4 text-xs text-slate-400 dark:text-slate-500">
        <p>Создано с помощью React, Tailwind CSS и Google Gemini API.</p>
      </footer>
    </div>
  );
};

export default App;