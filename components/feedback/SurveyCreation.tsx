import React, { useState } from 'react';
import type { Survey } from '../../types';
import Card from '../common/Card';

interface SurveyCreationProps {
  // FIX: Updated prop type to accept a partial survey, resolving type mismatch.
  onSurveyCreated: (survey: Pick<Survey, 'id' | 'employeeName' | 'createdAt'>) => void;
}

const SurveyCreation: React.FC<SurveyCreationProps> = ({ onSurveyCreated }) => {
  const [employeeName, setEmployeeName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeName.trim()) {
      // FIX: Removed incorrect 'Survey' type annotation. The created object is partial and does not include 'createdBy' or 'feedback' properties.
      const newSurvey = {
        id: `survey-${Date.now()}`,
        employeeName: employeeName.trim(),
        createdAt: new Date().toISOString(),
      };
      onSurveyCreated(newSurvey);
    }
  };

  return (
    <Card>
        <div className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Создать новый опрос для отзыва</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Введите имя сотрудника, для которого вы хотите собрать отзывы.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                    <label htmlFor="employeeName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Имя сотрудника
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            id="employeeName"
                            value={employeeName}
                            onChange={(e) => setEmployeeName(e.target.value)}
                            className="block w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="например, Иван Иванов"
                            required
                            autoFocus
                        />
                    </div>
                </div>
                <div className="text-right">
                    <button
                        type="submit"
                        disabled={!employeeName.trim()}
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/50 disabled:cursor-not-allowed"
                    >
                        Создать опрос
                    </button>
                </div>
            </form>
        </div>
    </Card>
  );
};

export default SurveyCreation;