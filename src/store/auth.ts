import { create } from 'zustand';
import { supabaseService } from '@/lib/supabase-service';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,
  
  initialize: async () => {
    if (get().initialized) return;
    
    set({ loading: true });
    
    try {
      // Check if user is already logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Get user profile from database
        const { data: profile, error } = await supabaseService.getCurrentUserProfile();
        
        if (profile && !error) {
          set({
            user: {
              id: profile.id,
              name: profile.name,
              email: profile.email,
              isAdmin: profile.is_admin
            },
            isAuthenticated: true
          });
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      set({ loading: false, initialized: true });
    }
  },
  
  checkSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile, error } = await supabaseService.getCurrentUserProfile();
        
        if (profile && !error) {
          set({
            user: {
              id: profile.id,
              name: profile.name,
              email: profile.email,
              isAdmin: profile.is_admin
            },
            isAuthenticated: true
          });
        }
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      console.error('Error checking session:', error);
      set({ user: null, isAuthenticated: false });
    }
  },
  
  login: async (email: string, password: string) => {
    set({ loading: true });
    
    try {
      const { data, error } = await supabaseService.signIn(email, password);
      
      if (error) {
        console.error('Login error:', error.message);
        set({ loading: false });
        return false;
      }
      
      if (data.user) {
        // Get user profile
        const { data: profile, error: profileError } = await supabaseService.getCurrentUserProfile();
        
        if (profile && !profileError) {
          set({
            user: {
              id: profile.id,
              name: profile.name,
              email: profile.email,
              isAdmin: profile.is_admin
            },
            isAuthenticated: true,
            loading: false
          });
          return true;
        }
      }
      
      set({ loading: false });
      return false;
    } catch (error) {
      console.error('Login error:', error);
      set({ loading: false });
      return false;
    }
  },
  
  signup: async (name: string, email: string, password: string) => {
    set({ loading: true });
    
    try {
      const { data, error } = await supabaseService.signUp(email, password, name);
      
      if (error) {
        console.error('Signup error:', error.message);
        set({ loading: false });
        return false;
      }
      
      if (data.user) {
        // For development, we'll auto-confirm the user
        // In production, you might want email confirmation
        
        // Wait a moment for the trigger to create the user profile
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get the newly created profile
        const { data: profile, error: profileError } = await supabaseService.getCurrentUserProfile();
        
        if (profile && !profileError) {
          set({
            user: {
              id: profile.id,
              name: profile.name,
              email: profile.email,
              isAdmin: profile.is_admin
            },
            isAuthenticated: true,
            loading: false
          });
          return true;
        }
      }
      
      set({ loading: false });
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      set({ loading: false });
      return false;
    }
  },
  
  logout: async () => {
    set({ loading: true });
    
    try {
      const { error } = await supabaseService.signOut();
      
      if (error) {
        console.error('Logout error:', error.message);
      }
      
      set({ 
        user: null, 
        isAuthenticated: false, 
        loading: false 
      });
    } catch (error) {
      console.error('Logout error:', error);
      set({ 
        user: null, 
        isAuthenticated: false, 
        loading: false 
      });
    }
  }
}));

// Initialize auth state when the store is created
if (typeof window !== 'undefined') {
  useAuthStore.getState().initialize();
  
  // Listen for auth changes
  supabase.auth.onAuthStateChange((event, session) => {
    const store = useAuthStore.getState();
    
    if (event === 'SIGNED_IN' && session?.user) {
      // Refresh user profile when signed in
      store.checkSession();
    } else if (event === 'SIGNED_OUT') {
      // Clear user data when signed out
      useAuthStore.setState({ 
        user: null, 
        isAuthenticated: false 
      });
    }
  });
}