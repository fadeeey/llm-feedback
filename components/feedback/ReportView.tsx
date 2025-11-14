import React, { useState, useEffect, useCallback } from 'react';
import type { Survey, AIReport } from '../../types';
import { generateReport } from '../../services/apiService';
import Spinner from '../common/Spinner';
import Card from '../common/Card';
import BarChart from '../common/BarChart';
import { ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon } from '../common/Icons';

interface ReportViewProps {
  survey: Survey;
  onStartNew: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ survey, onStartNew }) => {
  const [report, setReport] = useState<AIReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const feedbackList = survey.feedback || [];

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
    if (feedbackList.length > 0) {
        fetchReport();
    } else {
        setIsLoading(false);
        setError("Нет отзывов для создания отчета.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // FIX: Defined the missing 'renderSection' helper function.
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
            <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">Генерация AI-отчета...</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Ваш запрос обрабатывается. Анализируется {feedbackList.length} отзывов для сотрудника {survey.employeeName}.
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
            <h2 className="mt-4 text-xl font-semibold text-red-600 dark:text-red-400">Не удалось создать отчет</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{error}</p>
            <button
                onClick={fetchReport}
                className="mt-6 inline-flex items-center gap-2 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
                <ArrowPathIcon className="w-4 h-4" />
                Попробовать снова
            </button>
        </div>
      </Card>
    );
  }

  if (!report) return null;

  const rubricData = [
    { name: 'Коммуникация', value: report.rubric.communication },
    { name: 'Соблюдение сроков', value: report.rubric.deadlines },
    { name: 'Качество работы', value: report.rubric.quality },
    { name: 'Инициативность', value: report.rubric.initiative },
  ];

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI-отчет по отзывам: {survey.employeeName}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Создано {new Date(report.generated_at).toLocaleString()}</p>
            </div>
            <button
                onClick={onStartNew}
                className="inline-flex items-center gap-2 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
                Создать новый опрос
            </button>
        </div>
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Краткое резюме</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{report.summary}</p>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Оценочная рубрика</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Оценки по 10-балльной шкале, основанные на анализе всех отзывов.</p>
                    <div className="mt-4">
                        <BarChart data={rubricData} />
                    </div>
                </div>
            </Card>
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Ключевые выводы</h3>
                    <ul className="mt-4 list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        {report.bullets.map((bullet, index) => <li key={index}>{bullet}</li>)}
                    </ul>
                </div>
            </Card>
        </div>

        <Card>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderSection("Сильные стороны", report.strengths, <CheckCircleIcon className="w-5 h-5 text-green-500" />)}
                {renderSection("Области для улучшения", report.improvements, <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />)}
                {renderSection("Рекомендации к действию", report.recommendations, <ArrowPathIcon className="w-5 h-5 text-blue-500" />)}
            </div>
        </Card>
    </div>
  );
};

export default ReportView;