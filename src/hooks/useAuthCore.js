
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { getStoredUsers, setStoredUsers, getStoredSession, setStoredSession, clearStoredSession } from '@/lib/storage';

export function useAuthCore() {
  const [users, setUsers] = useState(getStoredUsers);
  const [currentUser, setCurrentUser] = useState(getStoredSession);

  // Ensure users object has a notifications array on load/init if missing
  useEffect(() => {
    let usersUpdated = false;
    const updatedUsers = Object.entries(users).reduce((acc, [username, userData]) => {
      if (!Array.isArray(userData.notifications)) {
        acc[username] = { ...userData, notifications: [] };
        usersUpdated = true;
      } else {
        acc[username] = userData;
      }
      return acc;
    }, {});

    if (usersUpdated) {
      setUsers(updatedUsers);
    }
  }, []); // Run once on mount

  useEffect(() => {
    setStoredUsers(users);
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      setStoredSession(currentUser);
    } else {
      clearStoredSession();
    }
  }, [currentUser]);

  const register = (username, password) => {
    if (users[username]) {
      toast({ title: "Registration Failed", description: "Username already exists.", variant: "destructive" });
      return { success: false, users: users };
    }
    if (!username || !password) {
      toast({ title: "Registration Failed", description: "Username and password are required.", variant: "destructive" });
      return { success: false, users: users };
    }
    // Initialize with empty notifications array
    const newUsers = { ...users, [username]: { password: password, websites: [], notifications: [] } };
    setUsers(newUsers);
    toast({ title: "Registration Successful", description: `Welcome, ${username}! Please log in.` });
    return { success: true, users: newUsers };
  };

  const login = (username, password) => {
    const user = users[username];
    if (user && user.password === password) {
      setCurrentUser({ username });
      toast({ title: "Login Successful", description: `Welcome back, ${username}!` });
      return true;
    } else {
      toast({ title: "Login Failed", description: "Invalid username or password.", variant: "destructive" });
      setCurrentUser(null);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    toast({ title: "Logged Out", description: "You have been logged out." });
  };

  return {
    currentUser,
    users,
    setUsers,
    register,
    login,
    logout,
  };
}
  