import React, { useState, useRef, useEffect } from 'react';
import Card from '../common/Card';
import { SparklesIcon, ExclamationTriangleIcon, CheckCircleIcon } from '../common/Icons';
import type { LoginResult } from '../../App';

interface AuthScreenProps {
  onLogin: (email: string, password: string) => LoginResult;
  onRegister: (name: string, email: string, password: string) => boolean;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onRegister }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the name input when we switch to register view after a failed login
    if (!isLoginView && error?.includes('Аккаунт не найден')) {
      nameInputRef.current?.focus();
    } else {
        emailInputRef.current?.focus();
    }
  }, [isLoginView, error]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (isLoginView) {
      if (!email || !password) {
        setError("Пожалуйста, введите email и пароль.");
        return;
      }
      const result = onLogin(email, password);
      
      if (result === 'not_found') {
        setIsLoginView(false);
        setError('Аккаунт не найден. Пожалуйста, укажите ваше имя для завершения регистрации.');
      } else if (result === 'wrong_password') {
        setError('Неверный пароль. Пожалуйста, попробуйте снова.');
      }
      // 'success' is handled by App re-render, no action needed here.

    } else {
      if (!name || !email || !password) {
        setError("Пожалуйста, заполните все поля.");
        return;
      }
      const success = onRegister(name, email, password);
      if (!success) {
        setError('Пользователь с таким email уже существует.');
      } else {
        setSuccessMessage('Аккаунт успешно создан! Теперь вы можете войти.');
        setIsLoginView(true);
        setName('');
        setPassword('');
        emailInputRef.current?.focus();
      }
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError(null);
    setSuccessMessage(null);
    setPassword('');
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <div className="p-8">
          <div className="flex flex-col items-center text-center">
            <SparklesIcon className="w-12 h-12 text-indigo-500" />
            <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
              {isLoginView ? 'Добро пожаловать!' : 'Создание аккаунта'}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {isLoginView ? 'Войдите в свой аккаунт, чтобы продолжить.' : 'Заполните форму для регистрации.'}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-md flex items-start space-x-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
            )}
            {successMessage && (
                 <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500/30 rounded-md flex items-start space-x-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700 dark:text-green-300">{successMessage}</p>
                </div>
            )}
            {!isLoginView && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Ваше имя
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="например, Анна Петрова"
                  required
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                ref={emailInputRef}
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Пароль
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="********"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/50 disabled:cursor-not-allowed"
              >
                {isLoginView ? 'Войти' : 'Зарегистрироваться'}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <button type="button" onClick={toggleView} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              {isLoginView ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuthScreen;