import React, { useState } from 'react';
import HackathonTeamBuilder from './components/HackathonTeamBuilder';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Story from './components/Story';
import Feedback from './components/Feedback';
import Contact from './components/Contact';
import Footer from './components/Footer';
import MyProfileManager from './components/MyProfileManager';
import './App.css';

function App() {
  const [showTeamBuilder, setShowTeamBuilder] = useState(false);
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [initialTab, setInitialTab] = useState('search');

  const handleNavigateToTeamBuilder = () => {
    setInitialTab('search');
    setShowTeamBuilder(true);
    setShowProfileManager(false);
  };

  const handleNavigateToProfile = () => {
    if (currentUserId) {
      setShowTeamBuilder(false);
      setShowProfileManager(true);
    } else {
      setInitialTab('profile');
      setShowTeamBuilder(true);
      setShowProfileManager(false);
    }
  };
  
  const handleProfileCreated = (userId) => {
    setCurrentUserId(userId);
    setShowProfileManager(true);
    setShowTeamBuilder(false);
  };

  const handleBackToHome = () => {
    setShowTeamBuilder(false);
    setShowProfileManager(false);
  };

  if (showProfileManager) {
    return (
      <MyProfileManager 
        currentUserId={currentUserId} 
        onNavigateBack={handleBackToHome} 
        onUpdateSuccess={handleBackToHome}
      />
    );
  }

  if (showTeamBuilder) {
    return (
      <HackathonTeamBuilder 
        onProfileCreated={handleProfileCreated} 
        currentUserId={currentUserId}
        onNavigateBack={handleBackToHome}
        initialTab={initialTab}
      />
    );
  }

  return (
    <div className="App">
      <Navbar onNavigateToProfile={handleNavigateToProfile} />
      <Hero />
      <div id="wrapper" className="relative z-10 w-full overflow-hidden bg-violet-50">
        <About />
        <Features onFindSquaddies={handleNavigateToTeamBuilder} />
        <Story />
        <Feedback />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

export default App;