
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { StickyNote, Link as LinkIcon, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

const HomePage = () => {
  const { currentUser } = useAuth(); // Get current user status
  const navigate = useNavigate();

  const iconVariants = {
    hover: { scale: 1.2, rotate: [0, 15, -10, 10, 0], transition: { duration: 0.4 } },
    initial: { opacity: 0, y: 30 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.5 + i * 0.15, type: 'spring', stiffness: 100 },
    }),
  };

  const icons = [
    { icon: StickyNote, color: 'text-yellow-500' },
    { icon: LinkIcon, color: 'text-blue-500' },
    { icon: ImageIcon, color: 'text-green-500' },
  ];

   const handleGetStartedClick = () => {
      if (currentUser) {
        navigate('/dashboard'); // Navigate to dashboard if logged in
      } else {
        navigate('/register'); // Navigate to register if not logged in
      }
    };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 pt-0">
      <Header />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5, ease: "backOut" }}
        className="w-full max-w-md text-center"
      >
        <Card className="bg-white/80 backdrop-blur-sm animate-float">
          <CardContent className="p-8 flex flex-col items-center space-y-6">
            <div className="flex space-x-6">
              {icons.map((item, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  className={`p-3 bg-gradient-to-br from-white to-gray-100 rounded-full shadow-cartoon-soft border-2 border-gray-200 ${item.color}`}
                >
                  <item.icon size={36} strokeWidth={2} />
                </motion.div>
              ))}
            </div>
            <p className="text-lg font-semibold text-purple-800 leading-relaxed">
              Share your notes, links and images. <br />
              <span className="text-pink-600 font-bold flex items-center justify-center gap-1">
                 <Sparkles size={18} className="inline animate-pulse-subtle"/> Lifetime Free! <Sparkles size={18} className="inline animate-pulse-subtle"/>
              </span>
            </p>
            {/* Use onClick handler */}
             <Button size="lg" className="mt-4 animate-bounce-in" onClick={handleGetStartedClick}>
                 GET STARTED
             </Button>

            {/* Only show Login link if not logged in */}
             {!currentUser && (
               <Link to="/login" className="text-sm text-purple-600 hover:text-pink-600 hover:underline pt-2">
                 Already have an account? Login
               </Link>
             )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default HomePage;
  