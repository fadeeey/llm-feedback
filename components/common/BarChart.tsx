
import React from 'react';

interface BarChartData {
    name: string;
    value: number;
}

interface BarChartProps {
    data: BarChartData[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
    const maxValue = 10; // Rubric score is out of 10
    const colors = ['bg-indigo-500', 'bg-purple-500', 'bg-sky-500', 'bg-teal-500'];

    return (
        <div className="space-y-4">
            {data.map((item, index) => (
                <div key={item.name} className="flex items-center">
                    <div className="w-36 text-sm text-slate-600 dark:text-slate-400 pr-2">{item.name}</div>
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                        <div
                            className={`${colors[index % colors.length]} h-4 rounded-full flex items-center justify-end pr-2`}
                            style={{ width: `${(item.value / maxValue) * 100}%` }}
                        >
                           <span className="text-xs font-bold text-white">{item.value.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BarChart;
