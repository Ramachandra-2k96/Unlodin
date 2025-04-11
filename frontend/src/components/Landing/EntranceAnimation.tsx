import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';
import anime from 'animejs';

const EntranceAnimation: React.FC = () => {
  useEffect(() => {
    // Add a black background to body to prevent white flash
    document.body.style.backgroundColor = "#0f172a"; // slate-900
    
    // Initial entrance animation
    const entranceAnimation = anime.timeline({
      easing: 'easeOutExpo',
    })
    .add({
      targets: '.entrance-logo',
      scale: [0, 1],
      opacity: [0, 1],
      rotate: ['-10deg', '0deg'],
      duration: 1000,
    })
    .add({
      targets: '.entrance-text span',
      translateY: [40, 0],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(80),
    }, '-=600');

    // Text animation
    const title = document.querySelector('.entrance-text');
    if (title) {
      const spans = title.querySelectorAll('span');
      spans.forEach((span, index) => {
        anime({
          targets: span,
          opacity: [0, 1],
          translateY: [40, 0],
          easing: 'easeOutExpo',
          duration: 700,
          delay: 600 + (index * 100)
        });
      });
    }

    // Clean up animation
    return () => {
      anime.remove('.entrance-logo');
      anime.remove('.entrance-text span');
    };
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.3,
        exit: { duration: 0.2 }
      }}
    >
      <div className="entrance-logo flex items-center justify-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full blur-md opacity-60"></div>
          <div className="relative bg-slate-900/90 rounded-full p-5">
            <Truck className="w-16 h-16 text-yellow-400" />
          </div>
        </div>
        <div className="entrance-text ml-4 flex items-center text-7xl font-bold">
          <span className="text-white opacity-0">UNLOD</span>
          <span className="text-yellow-400 opacity-0">IN</span>
        </div>
      </div>
    </motion.div>
  );
};

export default EntranceAnimation;
