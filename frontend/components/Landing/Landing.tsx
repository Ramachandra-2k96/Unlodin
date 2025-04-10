import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import About from './About';
import Contact from './Contact';
import Footer from './Footer';
import EntranceAnimation from './EntranceAnimation';
import ChatBot from '../ChatBot';

const Landing: React.FC = () => {
  const [showEntrance, setShowEntrance] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    // Hide entrance animation after 3 seconds
    const timer = setTimeout(() => {
      // Set content as loaded before hiding entrance to prevent blank screen
      setContentLoaded(true);
      
      // Small delay to ensure content is ready before hiding entrance
      setTimeout(() => {
        setShowEntrance(false);
      }, 200);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showEntrance ? (
          <EntranceAnimation key="entrance" />
        ) : (
          <motion.div 
            key="content"
            className="overflow-hidden bg-slate-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {contentLoaded && <Navbar />}
            <motion.section 
              id="hero"
              className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Hero />
            </motion.section>
            <motion.section 
              id="features"
              className="bg-slate-950"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <Features />
            </motion.section>
            <motion.section 
              id="about"
              className="bg-slate-950"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <About />
            </motion.section>
            <motion.section 
              id="contact"
              className="bg-slate-950"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <Contact />
            </motion.section>
            <Footer />
            
            {/* Chatbot only appears when entrance animation is complete */}
            {contentLoaded && !showEntrance && <ChatBot />}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Landing; 