import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface StatCardProps {
  title: string;
  value: number;
  unit?: string;
  trend?: number;
  trendReversed?: boolean;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  unit = '', 
  trend = 0, 
  trendReversed = false,
  icon 
}) => {
  const { theme } = useTheme();
  
  const getTrendColor = (trend: number, reversed: boolean) => {
    if (trend === 0) return theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
    const isPositive = reversed ? trend < 0 : trend > 0;
    return isPositive ? 'text-green-500' : 'text-red-500';
  };

  const trendColor = getTrendColor(trend, trendReversed);

  return (
    <div className={`rounded-lg shadow p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold">
              {value}{unit}
            </p>
            {trend !== 0 && (
              <span className={`ml-2 flex items-center text-sm ${trendColor}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>
        <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;