import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Truck, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on initial load
    checkScreenSize();

    // Check on resize
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Determine active section for nav highlighting
      const sections = ['hero', 'features', 'about', 'contact'];
      const currentPos = window.scrollY + 150;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offset = element.offsetTop;
          
          if (currentPos >= offset && currentPos < offset + element.offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
    setIsMobileMenuOpen(false);
    setIsExpanded(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-5">
      <motion.div 
        className="relative flex items-center justify-between"
        initial={{ width: "60%", borderRadius: "36px", y: 10 }}
        animate={{ 
          width: isExpanded || isMobileMenuOpen ? "90%" : isMobile && isScrolled ? "60%" : "70%",
          borderRadius: "36px",
          y: 0,
          boxShadow: isScrolled ? "0 10px 30px -10px rgba(0, 0, 0, 0.5)" : "0 5px 15px -5px rgba(0, 0, 0, 0.3)"
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Background with blur effect */}
        <motion.div 
          className="absolute inset-0 bg-slate-900/85 backdrop-blur-lg border border-yellow-900/30 rounded-3xl overflow-hidden"
          layout
        >
          {/* Dynamic highlight effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -inset-[400px] bg-yellow-400/5 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          </div>
        </motion.div>

        <div className="relative px-5 py-3 w-full flex items-center justify-between">
          {/* Logo section */}
          <motion.div 
            className="flex items-center space-x-2"
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-yellow-500 rounded-full opacity-20 blur-md"></div>
              <div className="relative rounded-full p-2">
                <Truck className="w-7 h-7 text-yellow-400" />
              </div>
            </div>
            <motion.h1 
              className="text-xl sm:text-2xl font-bold text-white"
              animate={{ opacity: isExpanded || isMobileMenuOpen || !isScrolled || !isMobile ? 1 : 0.7 }}
            >
              <span className="text-white">UNLOD</span><span className="text-yellow-400">IN</span>
            </motion.h1>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-8">
            <AnimatePresence>
              {(isExpanded || !isScrolled || !isMobile) && (
                <motion.div 
                  className="flex items-center space-x-1 lg:space-x-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {['features', 'about', 'contact'].map((item) => (
                    <motion.button
                      key={item}
                      onClick={() => scrollToSection(item)}
                      className={`nav-item px-3 py-2 capitalize text-sm font-medium transition-all duration-300 ${
                        activeSection === item 
                          ? 'text-yellow-400' 
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      <span className="relative">
                        {item}
                        {activeSection === item && (
                          <motion.span 
                            className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-400 rounded-full"
                            layoutId="activeSection"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          ></motion.span>
                        )}
                      </span>
                    </motion.button>
                  ))}
                  
                  <Link to="/orders">
                    <motion.button
                      className="nav-item px-3 py-2 capitalize text-sm font-medium text-gray-300 hover:text-yellow-300 transition-all duration-300"
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      <span className="relative">orders</span>
                    </motion.button>
                  </Link>
                  
                  <div className="flex items-center space-x-3">
                    <Link to="/login">
                      <motion.button 
                        className="flex items-center text-slate-300 hover:text-yellow-400 text-sm font-medium transition-all duration-300 space-x-1"
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 0 }}
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Login</span>
                      </motion.button>
                    </Link>
                    <Link to="/signup">
                      <motion.button 
                        className="ml-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-medium text-sm px-6 py-2.5 rounded-lg transition-all duration-300 flex items-center space-x-1"
                        whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(234, 179, 8, 0.3)" }}
                        whileTap={{ y: 0, boxShadow: "0 0px 0px 0px rgba(234, 179, 8, 0)" }}
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Sign Up</span>
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-white transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="absolute top-24 left-0 right-0 mx-auto w-[90%] bg-slate-800/95 backdrop-blur-lg rounded-xl border border-slate-700/50 overflow-hidden z-50"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="py-3">
              {['features', 'about', 'contact'].map((item, index) => (
                <motion.button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`block w-full text-left px-6 py-4 capitalize text-lg ${
                    activeSection === item 
                      ? 'text-yellow-400 bg-slate-700/50' 
                      : 'text-slate-300 hover:bg-slate-700/30'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {item}
                </motion.button>
              ))}
              <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}>
                <motion.div 
                  className="block w-full text-left px-6 py-4 text-lg text-slate-300 hover:bg-slate-700/30 flex items-center space-x-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.3 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>orders</span>
                </motion.div>
              </Link>
              <Link to="/login">
                <motion.div 
                  className="block w-full text-left px-6 py-4 text-lg text-slate-300 hover:bg-slate-700/30 flex items-center space-x-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.4 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </motion.div>
              </Link>
              <div className="px-5 pt-3 pb-5">
                <Link to="/signup">
                  <motion.button 
                    className="w-full bg-yellow-500 text-slate-900 font-medium px-4 py-3 rounded-lg hover:bg-yellow-400 transition-all duration-300 flex items-center justify-center space-x-2"
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Sign Up</span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;