import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Story from './components/Story';
import Feedback from './components/Feedback';
import Contact from './components/Contact';
import Footer from './components/Footer';

const LandingPage = ({ onNavigateToTeamBuilder }) => {
  return (
    <>
      <Navbar />
      <Hero />
      <div id="wrapper" className="relative z-10 w-full overflow-hidden bg-violet-50">
        <About />
        <Features onFindSquaddies={onNavigateToTeamBuilder} />
        <Story />
        <Feedback />
        <Contact />
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;