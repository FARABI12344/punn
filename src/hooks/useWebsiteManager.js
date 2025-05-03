
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { getStoredWebsites, setStoredWebsites } from '@/lib/storage';
import { isValidPageName } from '@/lib/utils';

export function useWebsiteManager(currentUser, users, setUsers) {
  const [websites, setWebsites] = useState(getStoredWebsites);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (currentUser && users[currentUser.username]) {
      setNotifications(users[currentUser.username].notifications || []);
    } else {
      setNotifications([]);
    }
  }, [currentUser, users]);


  useEffect(() => {
    setStoredWebsites(websites);
  }, [websites]);


  const addWebsite = (pageName, title, shortDescription, longDescription, files = [], images = []) => {
    if (!currentUser) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return false;
    }
    if (websites[pageName]) {
      toast({ title: "Error", description: `Page name "${pageName}" already exists.`, variant: "destructive" });
      return false;
    }
    if (!isValidPageName(pageName)) {
      toast({ title: "Error", description: "Invalid page name. Use only letters, numbers, hyphens, underscores.", variant: "destructive" });
      return false;
    }

    const userWebsitesList = users[currentUser.username]?.websites || [];
    if (userWebsitesList.length >= 10) {
      toast({ title: "Limit Reached", description: "You cannot create more than 10 websites.", variant: "destructive" });
      return false;
    }

    const newWebsiteData = {
        pageName,
        title,
        shortDescription,
        description: longDescription,
        files: files.map(f => ({ name: f.name })), // Store only names for now
        images: images.map(f => ({ name: f.name })), // Store only names for now
        owner: currentUser.username,
        suspended: false,
        suspensionDetails: null,
        createdAt: new Date().toISOString()
    };

    setWebsites(prev => ({ ...prev, [pageName]: newWebsiteData }));

    setUsers(prevUsers => ({
      ...prevUsers,
      [currentUser.username]: {
        ...prevUsers[currentUser.username],
        websites: [...userWebsitesList, pageName]
      }
    }));

    toast({ title: "Website Created!", description: `Page "${pageName}" is live.` });
    return true;
  };

  const updateWebsite = (pageName, newTitle, newShortDescription, newLongDescription, newFiles = [], newImages = []) => {
    if (!currentUser) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return false;
    }
    const website = websites[pageName];
    if (!website || website.owner !== currentUser.username) {
      toast({ title: "Error", description: "Website not found or you don't own it.", variant: "destructive" });
      return false;
    }

    setWebsites(prev => ({
      ...prev,
      [pageName]: {
          ...prev[pageName],
          title: newTitle,
          shortDescription: newShortDescription,
          description: newLongDescription,
          files: newFiles.map(f => ({ name: f.name })), // Update stored names
          images: newImages.map(f => ({ name: f.name })), // Update stored names
        }
    }));
    toast({ title: "Website Updated", description: `Page "${pageName}" has been updated.` });
    return true;
  };

  const deleteWebsite = (pageName) => {
    if (!currentUser) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return false;
    }
    const website = websites[pageName];
    if (!website || website.owner !== currentUser.username) {
      toast({ title: "Error", description: "Website not found or you don't own it.", variant: "destructive" });
      return false;
    }

    setWebsites(prev => {
      const newState = { ...prev };
      delete newState[pageName];
      return newState;
    });

    setUsers(prevUsers => ({
      ...prevUsers,
      [currentUser.username]: {
        ...prevUsers[currentUser.username],
        websites: prevUsers[currentUser.username].websites.filter(name => name !== pageName)
      }
    }));
    toast({ title: "Website Deleted", description: `Page "${pageName}" has been removed.`, variant: "destructive" });
    return true;
  };

  const toggleSuspendWebsite = (pageName, reason = null) => {
     const website = websites[pageName];
     if (!website) return;

     const isSuspending = !website.suspended;
     const newSuspensionDetails = isSuspending ? { reason: reason || "No reason provided", timestamp: new Date().toISOString() } : null;

     setWebsites(prev => ({
       ...prev,
       [pageName]: {
         ...prev[pageName],
         suspended: isSuspending,
         suspensionDetails: newSuspensionDetails,
       }
     }));

     const ownerUsername = website.owner;
     const notificationMessage = isSuspending
         ? `Your page "/${pageName}" has been suspended. Reason: ${newSuspensionDetails.reason}`
         : `Your page "/${pageName}" has been unsuspended.`;

     addNotification(ownerUsername, notificationMessage, isSuspending ? 'destructive' : 'info');

     toast({
         title: `Website ${isSuspending ? 'Suspended' : 'Unsuspended'}`,
         description: `Page "/${pageName}" status updated. Owner notified.`,
         variant: isSuspending ? 'destructive' : 'default'
     });
   };

  const addNotification = (username, message, type = 'info') => {
      if (!users[username]) {
          console.warn(`Attempted to notify non-existent user: ${username}`);
          return;
      }
      const newNotification = {
          id: Date.now() + Math.random(),
          message,
          type,
          timestamp: new Date().toISOString(),
          read: false,
      };

      setUsers(prevUsers => {
          const targetUser = prevUsers[username];
          const updatedNotifications = [...(targetUser.notifications || []), newNotification];
          return {
              ...prevUsers,
              [username]: {
                  ...targetUser,
                  notifications: updatedNotifications,
              }
          };
      });

       if (currentUser && currentUser.username === username) {
           setNotifications(prev => [...prev, newNotification]);
       }
  };

   const clearUserNotifications = () => {
        if (!currentUser) return;
        setUsers(prevUsers => ({
            ...prevUsers,
            [currentUser.username]: {
                ...prevUsers[currentUser.username],
                notifications: []
            }
        }));
        setNotifications([]);
        toast({ title: "Notifications Cleared"});
   };

   const appealSuspension = (pageName, appealMessage) => {
       const website = websites[pageName];
        if (!website || !website.owner || !currentUser) {
             toast({ title: "Appeal Failed", description: "Could not send appeal.", variant: "destructive" });
             return;
         }
        const ownerUsername = website.owner;
        const message = `Suspension Appeal for /${pageName} from ${currentUser.username}: "${appealMessage}"`;
        addNotification(ownerUsername, message, 'appeal');
        toast({ title: "Appeal Sent", description: `Your appeal for /${pageName} has been sent to the site owner.` });
    };


  const getUserWebsites = () => {
    if (!currentUser) return [];
    const userWebsiteNames = users[currentUser.username]?.websites || [];
    return userWebsiteNames.map(name => websites[name]).filter(Boolean);
  };

  const getWebsite = (pageName) => {
    return websites[pageName] || null;
  };

  const getAllWebsites = () => {
    return Object.values(websites);
  };

   const sendUserNotification = (targetUsername, message) => {
       addNotification(targetUsername, `Admin Message: ${message}`, 'info');
       toast({ title: "Notification Sent", description: `Message sent to ${targetUsername}.` });
   };


  return {
    websites,
    notifications,
    addWebsite,
    updateWebsite,
    deleteWebsite,
    getUserWebsites,
    getWebsite,
    getAllWebsites,
    toggleSuspendWebsite,
    sendUserNotification,
    clearUserNotifications,
    appealSuspension,
  };
}
  