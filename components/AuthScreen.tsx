import React, { useState } from 'react';
import Card from './common/Card';
import { SparklesIcon } from './common/Icons';

interface AuthScreenProps {
  onLoginOrRegister: (name: string) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginOrRegister }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLoginOrRegister(name.trim());
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
        <Card>
            <div className="p-8">
                <div className="flex flex-col items-center text-center">
                    <SparklesIcon className="w-12 h-12 text-indigo-500" />
                    <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Добро пожаловать!</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Пожалуйста, войдите или зарегистрируйтесь, чтобы продолжить.
                        Просто введите ваше имя для начала.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Ваше имя
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="например, Анна Петрова"
                                required
                                autoFocus
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/50 disabled:cursor-not-allowed"
                        >
                            Войти / Зарегистрироваться
                        </button>
                    </div>
                </form>
            </div>
        </Card>
    </div>
  );
};

export default AuthScreen;