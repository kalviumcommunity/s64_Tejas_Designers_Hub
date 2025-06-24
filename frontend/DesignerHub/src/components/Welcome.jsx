import React from 'react';
import { motion } from 'framer-motion';

const Welcome = () => {
  const brandVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const hubVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        delay: 0.5,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 z-[100]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
    >
      <div className="text-center">
        <motion.span 
          className="text-5xl md:text-7xl font-extrabold relative bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent"
          variants={brandVariants}
          initial="hidden"
          animate="visible"
        >
          Designer
        </motion.span>
        <motion.span 
          className="text-5xl md:text-7xl text-gray-200 font-light ml-2"
          variants={hubVariants}
          initial="hidden"
          animate="visible"
        >
          Hub
        </motion.span>
      </div>
    </motion.div>
  );
};

export default Welcome; 