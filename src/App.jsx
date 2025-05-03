
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'; // Import useLocation
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { AnimatePresence, motion } from 'framer-motion';

// Import Pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import PublicPage from '@/pages/PublicPage';
import OwnerPage from '@/pages/OwnerPage';
import NotFoundPage from '@/pages/NotFoundPage';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

// Layout component to wrap around routes for consistent animation
const AnimatedLayout = () => {
   const location = useLocation(); // Use the useLocation hook here
  return (
     <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname} // Use location.pathname from the hook
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} // Ensure layout takes full height
      >
         <Outlet /> {/* Renders the matched child route */}
      </motion.div>
    </AnimatePresence>
  );
};


const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
           <Route element={<AnimatedLayout />}> {/* Wrap routes with layout */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
               <Route
                 path="/owner"
                 element={<OwnerPage />} // Password protection handled inside the component
               />
              <Route path="/:pageName" element={<PublicPage />} />
              <Route path="*" element={<NotFoundPage />} /> {/* Catch-all for 404 */}
           </Route>
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
  