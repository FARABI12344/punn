
import React, { createContext, useContext } from 'react';
import { useAuthCore } from '@/hooks/useAuthCore';
import { useWebsiteManager } from '@/hooks/useWebsiteManager';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { currentUser, users, setUsers, register, login, logout } = useAuthCore();
  const {
    websites,
    notifications, // Add notifications state
    addWebsite,
    updateWebsite,
    deleteWebsite,
    getUserWebsites,
    getWebsite,
    getAllWebsites,
    toggleSuspendWebsite,
    sendUserNotification,
    clearUserNotifications, // Add function to clear notifications
    appealSuspension, // Add function for appeal
  } = useWebsiteManager(currentUser, users, setUsers); // Pass state and setters

  const value = {
    currentUser,
    users, // Expose users for owner page, etc.
    notifications, // Expose notifications
    register: (username, password) => {
        const result = register(username, password);
        return result.success;
    },
    login,
    logout,
    addWebsite,
    updateWebsite,
    deleteWebsite,
    getUserWebsites,
    getWebsite,
    getAllWebsites,
    toggleSuspendWebsite,
    sendUserNotification,
    clearUserNotifications, // Expose clear function
    appealSuspension, // Expose appeal function
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
  