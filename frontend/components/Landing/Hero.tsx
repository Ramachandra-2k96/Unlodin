import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { Truck, Package, Clock, BarChart, ChevronDown, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    // Add a black background to body to prevent white flash
    document.body.style.backgroundColor = "#0f172a"; // slate-900
  }, []);

  useEffect(() => {
    // Create animated particles in the background
    if (particlesRef.current) {
      const particlesContainer = particlesRef.current;
      const numberOfParticles = 30;
      
      for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 6 + 1;
        
        particle.className = 'absolute rounded-full bg-yellow-500 opacity-20';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        particlesContainer.appendChild(particle);
        
        anime({
          targets: particle,
          translateX: () => anime.random(-50, 50) + 'px',
          translateY: () => anime.random(-50, 50) + 'px',
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          easing: 'easeInOutSine',
          duration: () => anime.random(3000, 8000),
          loop: true,
          direction: 'alternate',
          delay: anime.random(0, 1000)
        });
      }
    }

    // Main hero animation sequence
    const heroAnimation = anime.timeline({
      easing: 'easeOutExpo',
    });

    heroAnimation
      .add({
        targets: '.hero-title .letter',
        translateY: [-120, 0],
        opacity: [0, 1],
        duration: 1500,
        delay: anime.stagger(80),
      })
      .add({
        targets: '.hero-subtitle',
        translateY: [40, 0],
        opacity: [0, 1],
        duration: 1000,
      }, '-=1200')
      .add({
        targets: '.hero-cta',
        translateY: [40, 0],
        opacity: [0, 1],
        duration: 800,
      }, '-=800')
      .add({
        targets: '.hero-feature',
        translateY: [30, 0],
        opacity: [0, 1],
        delay: anime.stagger(150),
        duration: 800,
      }, '-=600')
      .add({
        targets: '.scroll-indicator',
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 600
      }, '-=300')
      .add({
        targets: '.hero-graphic svg',
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 1000,
        easing: 'spring(1, 80, 10, 0)'
      }, '-=1200');

    // Continuous animations
    anime({
      targets: '.floating-truck',
      translateY: [-15, 0],
      rotate: ['-2deg', '2deg'],
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutQuad',
      duration: 3000
    });
    
    anime({
      targets: '.scroll-arrow',
      translateY: [0, 10],
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      duration: 1500
    });

    // Section transition animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              anime({
                targets: section,
                opacity: [0.5, 1],
                translateY: [20, 0],
                duration: 800,
                easing: 'easeOutExpo'
              });
            }
          });
        },
        { threshold: 0.1 }
      );
      
      observer.observe(section);
    });
  }, []);

  // Create text animation effect
  useEffect(() => {
    // Create text animation with letters
    const title = document.querySelector('.hero-title');
    if (title) {
      const unload = 'UNLOAD';
      const inPart = 'IN';

      const html = [
        ...unload.split('').map(letter => `<span class="letter inline-block text-white">${letter}</span>`),
        ...inPart.split('').map(letter => `<span class="letter inline-block text-yellow-400">${letter}</span>`)
      ].join('');

      title.innerHTML = html;
    }

  }, []);

  return (
    <div 
      className="hero-content min-h-screen relative flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Animated background particles */}
      <div ref={particlesRef} className="absolute inset-0 z-0"></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950/70 z-[1]"></div>
      
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9zdmc+')] bg-[length:60px_60px] z-0"></div>
      
      <div className="absolute top-20 right-0 w-1/2 lg:w-1/3 aspect-square bg-yellow-500/20 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-20 left-0 w-1/2 lg:w-1/3 aspect-square bg-yellow-300/20 rounded-full blur-[120px] -z-10"></div>
      
      <div ref={containerRef} className="relative z-10 container mx-auto px-4 py-8 md:py-16 lg:py-20 flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
        <div className="w-full lg:w-1/2 xl:w-2/5 text-center lg:text-left">
          <div className="floating-truck mb-6 inline-flex items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full blur-md opacity-60"></div>
              <div className="relative bg-slate-900/90 rounded-full p-3 sm:p-4">
                <Truck className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400" />
              </div>
            </div>
            <h1 className="hero-title ml-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className='text-white'>UNLOD</span><span className='text-yellow-400'>IN</span>
            </h1>
          </div>
          
          <p className="hero-subtitle text-lg sm:text-xl md:text-2xl text-slate-300 mb-6 sm:mb-10 font-light">
            Connect shippers and carriers with our intelligent logistics platform
          </p>

          <div className="hero-cta flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8 sm:mb-12">
            <Link to="/signup" className="w-full sm:w-auto">
              <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-yellow-500/20 transition-all duration-300 transform hover:translate-y-[-2px]">
                <span className="flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Sign Up</span>
                </span>
              </button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 rounded-xl blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-slate-800/70 backdrop-blur-sm text-white border border-slate-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold group-hover:border-yellow-500/50 transition-all duration-300 flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Login</span>
                </div>
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
            {[
              {icon: <Package className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />, text: "100+ Carriers"},
              {icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />, text: "24/7 Support"},
              {icon: <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />, text: "Real-time Tracking"},
              {icon: <BarChart className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />, text: "Smart Analytics"}
            ].map((feature, index) => (
              <div key={index} className="hero-feature flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-slate-300">
                <div className="flex-shrink-0 bg-slate-800 rounded-lg p-1.5 sm:p-2">
                  {feature.icon}
                </div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-graphic w-full lg:w-3/5 flex justify-center lg:justify-end hidden lg:flex lg:absolute lg:right-12 xl:right-24 2xl:right-40 lg:top-1/2 lg:-translate-y-1/2">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 to-yellow-300/20 rounded-3xl blur-md"></div>
            <div className="absolute -inset-2 bg-yellow-400/10 rounded-3xl blur-[25px] animate-pulse"></div>
            <div className="relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl shadow-xl shadow-slate-900/50 hover:shadow-2xl hover:shadow-yellow-600/20 transition-all duration-500 hover:-translate-y-1">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl p-3 sm:p-5 lg:p-6 overflow-hidden w-full">
                <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-yellow-500/10 p-1.5 sm:p-2 lg:p-3 rounded-lg">
                      <Truck className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-yellow-400" />
                    </div>
                    <h3 className="font-medium text-white text- sm:text-base lg:text-sm">Route Optimizer</h3>
                  </div>
                  <div className="flex right-0 space-x-1 px-8">
                      <div className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                        ×
                      </div>
                      <div className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                        –
                      </div>
                      <div className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
                        +
                      </div>
                    </div>
                </div>
                
                <div className="space-y-2 sm:space-y-3 lg:space-y-4 mb-4 lg:mb-6">
                  {[
                    { from: "Mumbai, MH", to: "Pune, MH", status: "Matched", color: "bg-yellow-500" },
                    { from: "Delhi, DL", to: "Jaipur, RJ", status: "En Route", color: "bg-blue-500" },
                    { from: "Bangalore, KA", to: "Chennai, TN", status: "Pending", color: "bg-amber-500" },
                  ].map((route, idx) => (
                    <div key={idx} className="bg-slate-800/70 rounded-lg p-2 sm:p-3 lg:p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-3 lg:h-3 rounded-full ${route.color}`}></div>
                          <span className="text-xs sm:text-sm lg:text-base text-slate-300">{route.from}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 lg:mt-2">
                          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-3 lg:h-3 rounded-full bg-slate-600`}></div>
                          <span className="text-xs sm:text-sm lg:text-base text-slate-400">{route.to}</span>
                        </div>
                      </div>
                      <div className={`text-[10px] sm:text-xs lg:text-sm px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 lg:py-1.5 rounded-full ${route.color.replace('bg-', 'bg-').replace('500', '500/20')} ${route.color.replace('bg-', 'text-')}`}>
                        {route.status}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center">
                  <div className="w-32 sm:w-40 lg:w-56 h-1 sm:h-1.5 lg:h-2 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="scroll-indicator absolute bottom-6 sm:bottom-10  transform -translate-x-1/2 md:-translate-x-1/2 z-20 flex flex-col items-center">
        <span className="text-slate-400 text-xs mb-1 sm:mb-2 font-light">Scroll Down</span>
        <ChevronDown className="scroll-arrow w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 items-center" />
      </div>
    </div>
  );
};

export default Hero;