import React from 'react';
import { Coffee, DollarSign, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, isLoading, iconColor, icon }) => {
  const colorStyles = {
    green: {
      iconBg: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    red: {
      iconBg: 'bg-red-100 dark:bg-red-900',
      iconColor: 'text-red-600 dark:text-red-400',
    },
    yellow: {
      iconBg: 'bg-yellow-100 dark:bg-yellow-900',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
    }
  };

  const selectedStyle = colorStyles[iconColor] || colorStyles.green;
  const IconComponent = { Coffee, DollarSign, TrendingUp }[icon] || Coffee;

  return (
    <div className="border dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-800">
      <div className="flex items-center mb-2">
        <div className={`w-8 h-8 rounded-lg ${selectedStyle.iconBg} flex items-center justify-center mr-2`}>
          <IconComponent className={`w-5 h-5 ${selectedStyle.iconColor}`} />
        </div>
        <div className="text-sm font-extrabold text-gray-900 dark:text-white">{title}</div>
      </div>
      <div className="text-xl mt-6 font-light text-gray-900 dark:text-white">
        {isLoading ? <span className="text-gray-400 dark:text-gray-500">Loading...</span> : value}
      </div>
    </div>
  );
};

export default StatCard;