import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon, onClick }) => {
  const { theme } = useTheme();
  
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-lg transition-colors duration-200 flex items-center gap-4 ${
        theme === 'dark'
          ? 'hover:bg-gray-700 focus:bg-gray-700'
          : 'hover:bg-gray-100 focus:bg-gray-100'
      }`}
    >
      <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
        {icon}
      </div>
      <div className="text-left">
        <h3 className="font-medium">{title}</h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {description}
        </p>
      </div>
    </button>
  );
};

export default ActionCard;