
import React, { useState, useEffect, useCallback } from 'react';
import type { Survey, AIReport } from '../types';
import { generateReport } from '../services/geminiService';
import Spinner from './common/Spinner';
import Card from './common/Card';
import BarChart from './common/BarChart';
import { ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon } from './common/Icons';

interface ReportViewProps {
  survey: Survey;
  feedbackList: string[];
  onStartNew: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ survey, feedbackList, onStartNew }) => {
  const [report, setReport] = useState<AIReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateReport(feedbackList);
      setReport(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [feedbackList]);

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderSection = (title: string, items: string[], icon: React.ReactNode) => (
    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
      <h4 className="flex items-center text-md font-semibold text-slate-800 dark:text-slate-200">
        {icon}
        <span className="ml-2">{title}</span>
      </h4>
      <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
        {items.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    </div>
  );

  if (isLoading) {
    return (
      <Card>
        <div className="p-10 flex flex-col items-center justify-center text-center">
            <Spinner />
            <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">Generating AI Report...</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Gemini is analyzing {feedbackList.length} feedback entries for {survey.employeeName}. This may take a moment.
            </p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <ExclamationTriangleIcon className="w-12 h-12 text-red-500" />
            <h2 className="mt-4 text-xl font-semibold text-red-600 dark:text-red-400">Failed to Generate Report</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{error}</p>
            <button
                onClick={fetchReport}
                className="mt-6 inline-flex items-center gap-2 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
                <ArrowPathIcon className="w-4 h-4" />
                Retry
            </button>
        </div>
      </Card>
    );
  }

  if (!report) return null;

  const rubricData = [
    { name: 'Communication', value: report.rubric.communication },
    { name: 'Deadlines', value: report.rubric.deadlines },
    { name: 'Quality', value: report.rubric.quality },
    { name: 'Initiative', value: report.rubric.initiative },
  ];

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Feedback Report: {survey.employeeName}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Generated on {new Date(report.generated_at).toLocaleString()}</p>
            </div>
            <button
                onClick={onStartNew}
                className="inline-flex items-center gap-2 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
                Create New Survey
            </button>
        </div>
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Executive Summary</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{report.summary}</p>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Performance Rubric</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Scores are out of 10, based on an analysis of all feedback.</p>
                    <div className="mt-4">
                        <BarChart data={rubricData} />
                    </div>
                </div>
            </Card>
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Key Takeaways</h3>
                    <ul className="mt-4 list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        {report.bullets.map((bullet, index) => <li key={index}>{bullet}</li>)}
                    </ul>
                </div>
            </Card>
        </div>

        <Card>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderSection("Strengths", report.strengths, <CheckCircleIcon className="w-5 h-5 text-green-500" />)}
                {renderSection("Areas for Improvement", report.improvements, <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />)}
                {renderSection("Actionable Recommendations", report.recommendations, <ArrowPathIcon className="w-5 h-5 text-blue-500" />)}
            </div>
        </Card>
    </div>
  );
};

export default ReportView;
