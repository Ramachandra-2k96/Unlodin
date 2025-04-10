import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Route, Clock, BarChart } from 'lucide-react';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}> = ({ icon, title, description, index }) => {
  return (
    <motion.div
      className="relative bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1,
        type: "spring",
        stiffness: 50
      }}
      whileHover={{ 
        y: -10,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
        transition: { duration: 0.3 }
      }}
    >
      <motion.div 
        className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 origin-left"
        layoutId={`card-bg-${index}`}
      />
      <div className="relative p-8 h-full flex flex-col">
        <motion.div 
          className="bg-yellow-500/10 text-yellow-400 rounded-xl w-16 h-16 flex items-center justify-center mb-6"
          whileHover={{ 
            scale: 1.1,
            rotate: 5,
            transition: { duration: 0.3 }
          }}
        >
          {icon}
        </motion.div>
        <h3 className="text-2xl font-semibold mb-4 text-white tracking-tight font-display">{title}</h3>
        <p className="text-slate-400 text-lg font-light leading-relaxed">{description}</p>
        <div className="mt-6 pt-4 border-t border-slate-700 flex justify-end">
          <motion.a 
            href="#" 
            className="text-yellow-400 font-medium flex items-center group"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            Learn more 
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 ml-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </motion.svg>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <Route className="w-8 h-8" />,
      title: "Smart Route Planning",
      description: "AI-powered route optimization for efficient deliveries and reduced fuel costs across your entire fleet."
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Fleet Management",
      description: "Real-time fleet tracking and maintenance scheduling for optimal vehicle performance and longevity."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Time Management",
      description: "Automated scheduling and delivery time predictions with AI-driven insights for better planning."
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: "Analytics Dashboard",
      description: "Comprehensive analytics and visual reporting for data-driven decisions to optimize your operations."
    }
  ];

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Background gradient effects */}
      <motion.div
        className="absolute top-0 -right-1/4 w-1/2 h-1/2 bg-yellow-500/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-0 -left-1/4 w-1/2 h-1/2 bg-yellow-500/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 1
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-5xl font-bold mb-6 text-white font-display leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Delivery Management <span className="text-yellow-400">Features</span>
          </motion.h2>
          <motion.p 
            className="text-slate-400 text-xl font-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Streamline your delivery operations with our comprehensive suite of features
            designed to optimize efficiency and enhance customer satisfaction.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;