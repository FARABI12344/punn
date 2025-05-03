
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Removed CardFooter
import { useToast } from '@/components/ui/use-toast';
import { ShieldCheck, EyeOff, Unlock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OwnerWebsiteCard from '@/components/owner/OwnerWebsiteCard'; // Import the refactored card

const OWNER_PASSWORD = 'farabiontop12$'; // Hardcoded password

const OwnerPage = () => {
  const { getAllWebsites, toggleSuspendWebsite, sendUserNotification } = useAuth();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [websites, setWebsites] = useState([]);

  // Fetch websites only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setWebsites(getAllWebsites());
    } else {
        setWebsites([]); // Clear websites if not authenticated
    }
  }, [isAuthenticated]); // Removed getAllWebsites dependency as it's stable from context

  // Function to refetch websites after an action - useful if data could change externally
   const refetchWebsites = () => {
       if (isAuthenticated) {
           setWebsites(getAllWebsites());
       }
   };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    if (password === OWNER_PASSWORD) {
      setIsAuthenticated(true);
      toast({ title: "Owner Access Granted" });
    } else {
      toast({ title: "Access Denied", description: "Incorrect password.", variant: "destructive" });
    }
    setLoading(false);
    setPassword('');
  };

  const handleToggleSuspend = (pageName, reason) => {
    toggleSuspendWebsite(pageName, reason);
    // Update local state immediately for UI responsiveness
    setWebsites(prev => prev.map(site =>
      site.pageName === pageName
        ? { ...site, suspended: !site.suspended, suspensionDetails: !site.suspended ? { reason: reason || "No reason provided", timestamp: new Date().toISOString() } : null }
        : site
    ));
    // Note: Toast is now handled within toggleSuspendWebsite in the hook
  };

  const handleSendNotification = (username) => {
    const message = prompt(`Enter notification message for ${username}:`);
    if (message) {
      sendUserNotification(username, message);
      // Toast shown in sendUserNotification from hook
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-cartoon-soft">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 120 }}
          className="w-full max-w-sm"
        >
          <Card className="bg-white/90 backdrop-blur-md shadow-cartoon-hard border-2 border-purple-400 animate-pop-in">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-purple-900 flex items-center justify-center gap-2">
                <ShieldCheck className="text-purple-600" /> Owner Access
              </CardTitle>
              <CardDescription className="text-center">
                Enter the owner password to manage websites.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="owner-password">Password</Label>
                  <Input
                    id="owner-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter owner password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading} size="lg">
                  {loading ? 'Verifying...' : <><Unlock className="mr-2" size={18} /> Unlock</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // If authenticated, show the owner dashboard
  return (
    <div className="min-h-screen bg-gradient-cartoon-soft p-4 md:p-8">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8 md:mb-12"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-purple-900 flex items-center gap-2"><ShieldCheck /> Owner Dashboard</h1>
        <Button variant="secondary" size="sm" onClick={() => setIsAuthenticated(false)} className="flex items-center gap-1">
          <EyeOff size={16} /> Lock Panel
        </Button>
      </motion.header>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h2 className="text-xl font-bold text-purple-800 mb-6">All User Websites ({websites.length})</h2>
        {websites.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No websites found.</p>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {websites.map((website) => (
                <OwnerWebsiteCard
                  key={website.pageName}
                  website={website}
                  onToggleSuspend={handleToggleSuspend}
                  onSendNotification={handleSendNotification}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OwnerPage;
  