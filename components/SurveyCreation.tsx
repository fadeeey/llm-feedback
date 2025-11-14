
import React, { useState } from 'react';
import type { Survey } from '../types';
import Card from './common/Card';

interface SurveyCreationProps {
  onSurveyCreated: (survey: Survey) => void;
}

const SurveyCreation: React.FC<SurveyCreationProps> = ({ onSurveyCreated }) => {
  const [employeeName, setEmployeeName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeName.trim()) {
      const newSurvey: Survey = {
        id: `survey-${Date.now()}`,
        employeeName: employeeName.trim(),
        createdAt: new Date(),
      };
      onSurveyCreated(newSurvey);
    }
  };

  return (
    <Card>
        <div className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Create a New Feedback Survey</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Enter the name of the employee you want to collect feedback for. A unique survey link will be generated.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                    <label htmlFor="employeeName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Employee Name
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            id="employeeName"
                            value={employeeName}
                            onChange={(e) => setEmployeeName(e.target.value)}
                            className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="e.g., Jane Doe"
                            required
                        />
                    </div>
                </div>
                <div className="text-right">
                    <button
                        type="submit"
                        disabled={!employeeName.trim()}
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                    >
                        Create Survey & Get Link
                    </button>
                </div>
            </form>
        </div>
    </Card>
  );
};

export default SurveyCreation;
