import React from 'react';

const NavigationTabs = ({ activeTab, onTabChange }) => {
  return (
    <nav className="navigation-tabs">
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : 'inactive'}`}
          onClick={() => onTabChange('profile')}
        >
          Create Profile
        </button>
        <button
          className={`tab-button ${activeTab === 'search' ? 'active' : 'inactive'}`}
          onClick={() => onTabChange('search')}
        >
          Find Teammates
        </button>
      </div>
    </nav>
  );
};

export default NavigationTabs;