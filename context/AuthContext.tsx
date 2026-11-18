
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';

// Define the data shared through our authentication context.
interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

// Create the authentication context.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provide authentication state to the application.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // Restore the existing session when the app starts.
    const restoreSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session error:', error.message);
        }

        if (active) {
          setSession(data.session);
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    // Listen for sign-in, sign-out, and session changes.
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, newSession) => {
        if (active) {
          setSession(newSession);
        }
      });

    restoreSession();

    // Remove listener when the provider unmounts.
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for accessing authentication state.
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
