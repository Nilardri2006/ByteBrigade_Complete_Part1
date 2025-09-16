import React from 'react';
import { Search, Settings, UserPlus } from 'lucide-react';

const NavigationTabs = ({ activeTab, onTabChange, availableTabs = ['profile', 'search'] }) => {
  const tabs = [
    {
      id: 'profile',
      label: 'Create Profile',
      icon: UserPlus,
      color: 'blue'
    },
    {
      id: 'search',
      label: 'Find Teammates',
      icon: Search,
      color: 'green'
    },
    {
      id: 'manage',
      label: 'Manage Profile',
      icon: Settings,
      color: 'purple'
    }
  ];

  const visibleTabs = tabs.filter(tab => availableTabs.includes(tab.id));

  return (
    <div className="flex justify-center mb-8">
      <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200
                ${isActive 
                  ? `bg-blue-600 text-white shadow-sm` 
                  : `text-gray-600 hover:text-gray-900 hover:bg-gray-50`
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationTabs;
