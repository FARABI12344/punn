
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card'; // Only Card needed for empty state
import { useToast } from '@/components/ui/use-toast';
import { LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import Refactored Components
import WebsiteCard from '@/components/dashboard/WebsiteCard';
import CreateWebsiteDialog from '@/components/dashboard/CreateWebsiteDialog';
import EditWebsiteDialog from '@/components/dashboard/EditWebsiteDialog';
import NotificationsDropdown from '@/components/dashboard/NotificationsDropdown';

const MAX_WEBSITES = 10;

const DashboardPage = () => {
  const {
    currentUser,
    logout,
    addWebsite,
    updateWebsite,
    deleteWebsite,
    getUserWebsites,
    notifications, // Get notifications
    clearUserNotifications // Get clear function
  } = useAuth();
  const { toast } = useToast(); // Keep toast for potential page-specific errors if needed
  const userWebsites = getUserWebsites(); // Fetch websites on render

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState(null);

  const openEditDialog = (website) => {
    setEditingWebsite(website);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
     setEditingWebsite(null);
     setIsEditDialogOpen(false);
  }

  const handleDeleteWebsite = (pageName) => {
    deleteWebsite(pageName);
    // Toast is shown in deleteWebsite function from context/hook
  };

  const getAvatarFallback = (username) => {
    return username ? username.substring(0, 2).toUpperCase() : '??';
  }

  return (
    <div className="min-h-screen bg-gradient-cartoon-soft p-4 md:p-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="flex justify-between items-center mb-8 md:mb-12"
      >
        <div className="flex items-center gap-3">
          <Avatar className="border-purple-400 animate-bounce-in">
            <AvatarFallback>{getAvatarFallback(currentUser?.username)}</AvatarFallback>
          </Avatar>
          <h1 className="text-xl md:text-2xl font-bold text-purple-900">Welcome, {currentUser?.username}!</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          {/* Notifications */}
          <NotificationsDropdown
             notifications={notifications}
             onClearNotifications={clearUserNotifications}
           />

          <Button variant="secondary" size="sm" onClick={logout} className="flex items-center gap-1">
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </motion.header>

      {/* Create Website Button using Dialog Component */}
       <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 150 }}>
          <CreateWebsiteDialog
             addWebsite={addWebsite}
             websiteCount={userWebsites.length}
             maxWebsites={MAX_WEBSITES}
           />
        </motion.div>


      {/* Manage Websites */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h2 className="text-2xl font-bold text-purple-800 mb-6">Manage Websites ({userWebsites.length}/{MAX_WEBSITES})</h2>
        {userWebsites.length === 0 ? (
          <Card className="border-dashed border-2 border-purple-300 bg-purple-50/50 py-12 animate-pop-in">
            <CardContent className="text-center text-purple-600">
              <p className="text-lg font-semibold mb-2">No websites created yet!</p>
              <p>Click "CREATE NEW WEBSITE" above to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {userWebsites.map((website) => (
                <WebsiteCard
                  key={website.pageName}
                  website={website}
                  onEdit={openEditDialog}
                  onDelete={handleDeleteWebsite}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Edit Dialog using Component */}
      <EditWebsiteDialog
        isOpen={isEditDialogOpen}
        onOpenChange={closeEditDialog}
        website={editingWebsite}
        updateWebsite={updateWebsite}
      />

    </div>
  );
};

export default DashboardPage;
  