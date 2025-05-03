
import { toast } from '@/components/ui/use-toast';

const USERS_KEY = 'notesfun_users';
const WEBSITES_KEY = 'notesfun_websites';
const SESSION_KEY = 'notesfun_session';

const safeJsonParse = (key, fallbackValue) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallbackValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    localStorage.removeItem(key); // Clear corrupted data
    return fallbackValue;
  }
};

const safeJsonStringify = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
    toast({ title: "Storage Error", description: `Could not save ${key} data.`, variant: "destructive" });
  }
};

export const getStoredUsers = () => safeJsonParse(USERS_KEY, {});
export const setStoredUsers = (users) => safeJsonStringify(USERS_KEY, users);

export const getStoredWebsites = () => safeJsonParse(WEBSITES_KEY, {});
export const setStoredWebsites = (websites) => safeJsonStringify(WEBSITES_KEY, websites);

export const getStoredSession = () => safeJsonParse(SESSION_KEY, null);
export const setStoredSession = (session) => safeJsonStringify(SESSION_KEY, session);
export const clearStoredSession = () => localStorage.removeItem(SESSION_KEY);
  