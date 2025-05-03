
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gradient-cartoon-soft">
       <Header subtitle="Oops! Page Not Found"/>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
        className="max-w-md w-full"
       >
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-4xl shadow-cartoon-hard border-2 border-yellow-400">
          <motion.div
             animate={{ y: [0, -10, 0] }}
             transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
          </motion.div>
          <h2 className="text-4xl font-bold text-yellow-800 mb-2">404</h2>
          <p className="text-lg text-gray-600 mb-6">
            The page you're looking for doesn't seem to exist.
          </p>
          <Link to="/">
            <Button size="lg" variant="secondary">
              Go Back Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
  