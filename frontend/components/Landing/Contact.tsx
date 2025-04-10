import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Background gradient elements */}
      <motion.div 
        className="absolute top-0 left-0 w-3/4 h-1/2 bg-yellow-500/5 rounded-full blur-3xl opacity-50"
        animate={{
          scale: [1, 1.2, 1],
          x: [-100, 0, -100],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2 
          className="text-4xl font-bold text-center mb-16 text-white"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Get in <span className="text-yellow-400">Touch</span>
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants}>
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-6 text-white">Contact Information</h3>
              <div className="space-y-6 text-slate-300">
                <motion.div 
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-yellow-400" />
                  </div>
                  <span>contact@unloadin.com</span>
                </motion.div>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-yellow-400" />
                  </div>
                  <span>+1 (555) 123-4567</span>
                </motion.div>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-yellow-400" />
                  </div>
                  <span>123 Innovation Street, Tech City, TC 12345</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          <motion.form 
            className="space-y-6"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
              <motion.input
                type="text"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                whileFocus={{ scale: 1.01, borderColor: "#eab308" }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <motion.input
                type="email"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                whileFocus={{ scale: 1.01, borderColor: "#eab308" }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
              <motion.textarea
                rows={4}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                whileFocus={{ scale: 1.01, borderColor: "#eab308" }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
            
            <motion.button
              type="submit"
              className="w-full bg-yellow-500 text-slate-900 px-8 py-3 rounded-lg font-semibold"
              variants={itemVariants}
              whileHover={{ 
                y: -5,
                boxShadow: "0 10px 15px -3px rgba(234, 179, 8, 0.4)"
              }}
              whileTap={{ y: 0 }}
            >
              Send Message
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;