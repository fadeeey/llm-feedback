import React from 'react';
import Card from '../common/Card';
import { ExclamationTriangleIcon } from '../common/Icons';

const SurveyNotFound: React.FC = () => {
  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <div className="p-10 flex flex-col items-center justify-center text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">Опрос не найден</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Ссылка, по которой вы перешли, недействительна или срок ее действия истек. Пожалуйста, проверьте ссылку или свяжитесь с тем, кто ее отправил.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SurveyNotFound;
