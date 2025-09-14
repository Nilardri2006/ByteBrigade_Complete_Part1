import About from "./components/About";
import { useState } from 'react';
import HackathonTeamBuilder from './components/HackathonTeamBuilder';
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Features from "./components/Features";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Feedback from "./components/Feedback";
import MyProfileManager from './components/MyProfileManager';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import React from 'react'



const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
]);
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
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <NavBar onNavigateToProfile={handleNavigateToProfile} />
      <Hero />
      <div id="wrapper" className="relative z-10 w-full overflow-hidden bg-violet-50" />
      <About />
      <Features onFindSquaddies={handleNavigateToTeamBuilder} />
      <Story />
      <Feedback/>
      <Contact />
      <Footer />
    </main>
  );
}

export default App;