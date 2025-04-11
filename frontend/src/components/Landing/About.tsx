import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Users, Globe, Award, Shield } from 'lucide-react';

const About: React.FC = () => {
  const aboutRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate the section that came into view
            if (entry.target === aboutRef.current) {
              anime({
                targets: '.about-title',
                translateY: [30, 0],
                opacity: [0, 1],
                duration: 800,
                easing: 'easeOutExpo',
              });
              
              anime({
                targets: '.about-description',
                translateY: [20, 0],
                opacity: [0, 1],
                duration: 800,
                delay: 200,
                easing: 'easeOutExpo',
              });
              
              anime({
                targets: '.about-image',
                scale: [0.95, 1],
                opacity: [0, 1],
                duration: 1000,
                delay: 400,
                easing: 'easeOutExpo',
              });
            }
            
            if (entry.target === statsRef.current) {
              anime({
                targets: '.stat-card',
                translateY: [30, 0],
                opacity: [0, 1],
                duration: 800,
                delay: anime.stagger(150),
                easing: 'easeOutExpo',
              });
            }
            
            if (entry.target === teamRef.current) {
              anime({
                targets: '.team-title',
                translateY: [30, 0],
                opacity: [0, 1],
                duration: 800,
                easing: 'easeOutExpo',
              });
              
              anime({
                targets: '.team-member',
                translateY: [30, 0],
                opacity: [0, 1],
                duration: 800,
                delay: anime.stagger(150),
                easing: 'easeOutExpo',
              });
            }
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // Observe the sections
    if (aboutRef.current) observer.observe(aboutRef.current);
    if (statsRef.current) observer.observe(statsRef.current);
    if (teamRef.current) observer.observe(teamRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="about" className="py-20 bg-slate-950">
      <div className="container mx-auto px-4">
        {/* About Section */}
        <div ref={aboutRef} className="mb-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2">
              <h2 className="about-title text-3xl md:text-4xl font-bold mb-6 text-white opacity-0">
                About <span className="text-yellow-400">Unloadin</span>
              </h2>
              <p className="about-description text-lg text-slate-300 mb-6 opacity-0">
                Unloadin is revolutionizing the logistics industry by connecting shippers with reliable carriers through our intelligent platform. Founded in 2023, we've built a comprehensive solution that addresses the challenges of modern freight management.
              </p>
              <p className="about-description text-lg text-slate-300 mb-8 opacity-0">
                Our mission is to streamline the shipping process, reduce costs, and improve efficiency for businesses of all sizes. With our advanced technology and dedicated team, we're making logistics simpler, faster, and more reliable.
              </p>
              <div className="about-description flex flex-wrap gap-4 opacity-0">
                <button className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-medium px-6 py-3 rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-yellow-500/20">
                  Learn More
                </button>
                <button className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-6 py-3 rounded-lg border border-slate-700 transition-all duration-300 transform hover:translate-y-[-2px]">
                  Our Story
                </button>
              </div>
            </div>
            <div className="about-image w-full lg:w-1/2 opacity-0">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 to-yellow-300/20 rounded-3xl blur-md"></div>
                <div className="relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 overflow-hidden">
                  <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                      alt="Logistics Team" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <span className="text-sm text-slate-300">Live Operations</span>
                    </div>
                    <div className="text-sm text-slate-400">24/7 Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div ref={statsRef} className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Users className="w-8 h-8 text-yellow-400" />, value: "10,000+", label: "Active Users" },
              { icon: <Globe className="w-8 h-8 text-yellow-400" />, value: "50+", label: "Cities Covered" },
              { icon: <Award className="w-8 h-8 text-yellow-400" />, value: "98%", label: "Customer Satisfaction" },
              { icon: <Shield className="w-8 h-8 text-yellow-400" />, value: "100%", label: "Secure Transactions" }
            ].map((stat, index) => (
              <div key={index} className="stat-card bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 opacity-0">
                <div className="mb-4 bg-slate-900/50 rounded-lg p-3 w-fit">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Team Section */}
        <div ref={teamRef}>
          <h2 className="team-title text-3xl md:text-4xl font-bold mb-12 text-center text-white opacity-0">
            Meet Our <span className="text-yellow-400">Team</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Alex Johnson", role: "CEO & Founder", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" },
              { name: "Sarah Chen", role: "CTO", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80" },
              { name: "Michael Rodriguez", role: "Head of Operations", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" }
            ].map((member, index) => (
              <div key={index} className="team-member bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden opacity-0">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-slate-400">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;