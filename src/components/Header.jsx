
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Header = ({ subtitle, showLink = false }) => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
      className="w-full py-6 text-center mb-8 md:mb-12 relative overflow-hidden"
    >
        {/* Animated background shapes */}
        <motion.div
            className="absolute top-0 left-0 w-20 h-20 bg-pink-300/50 rounded-full filter blur-2xl -translate-x-1/2 -translate-y-1/4"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0]}}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
         <motion.div
            className="absolute bottom-0 right-0 w-24 h-24 bg-purple-300/50 rounded-full filter blur-2xl translate-x-1/4 translate-y-1/4"
            animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0]}}
            transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 5 }}
        />

      <motion.h1
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.3 }}
        className="text-5xl md:text-7xl font-bold text-stroke-cartoon text-white relative z-10 flex items-center justify-center gap-3"
      >
         <Sparkles className="text-yellow-300 w-8 h-8 md:w-12 md:h-12 animate-pulse-glow" />
          NOTES FUN
         <Sparkles className="text-yellow-300 w-8 h-8 md:w-12 md:h-12 animate-pulse-glow" />
      </motion.h1>

      {subtitle && (
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 relative z-10"
         >
             <div className="inline-block bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-cartoon-soft border-2 border-purple-200">
                 <span className="text-lg font-semibold text-purple-700">{subtitle}</span>
                {showLink && (
                   <Link to="/" className="ml-2 text-sm text-pink-600 hover:underline">(Create Free Page Now!)</Link>
                )}
             </div>
         </motion.div>
       )}
    </motion.header>
  );
};

export default Header;
  