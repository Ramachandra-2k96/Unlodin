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
      scale: [0.5, 1],
      opacity: [0, 1],
      rotate: ['-5deg', '0deg'],
      duration: 800,
    })
    .add({
      targets: '.entrance-text span',
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(60),
    }, '-=400');

    // Text animation with responsive timing
    const title = document.querySelector('.entrance-text');
    if (title) {
      const spans = title.querySelectorAll('span');
      spans.forEach((span, index) => {
        anime({
          targets: span,
          opacity: [0, 1],
          translateY: [20, 0],
          easing: 'easeOutExpo',
          duration: 500,
          delay: 400 + (index * 80)
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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.3,
        exit: { duration: 0.2 }
      }}
    >
      <div className="entrance-logo flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
        <div className="relative">
          <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full blur-md opacity-60"></div>
          <div className="relative bg-slate-900/90 rounded-full p-3 sm:p-5">
            <Truck className="w-10 h-10 sm:w-16 sm:h-16 text-yellow-400" />
          </div>
        </div>
        <div className="entrance-text flex items-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
          <span className="text-white opacity-0">UNLOD</span>
          <span className="text-yellow-400 opacity-0">IN</span>
        </div>
      </div>
      
      {/* Mobile subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-slate-400 text-sm sm:text-base mt-4 text-center max-w-[80%] sm:max-w-none"
      >
        Connecting shippers and carriers
      </motion.p>
    </motion.div>
  );
};

export default EntranceAnimation;
