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
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithApple: () => Promise<void>;
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
        const result = await supabaseService.getCurrentUserProfile();
        
        if (result?.data && !result?.error) {
          set({
            user: {
              id: result.data.id,
              name: result.data.name,
              email: result.data.email,
              isAdmin: result.data.is_admin
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
        const result = await supabaseService.getCurrentUserProfile();
        
        if (result?.data && !result?.error) {
          set({
            user: {
              id: result.data.id,
              name: result.data.name,
              email: result.data.email,
              isAdmin: result.data.is_admin
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
  
  signInWithGoogle: async () => {
    set({ loading: true });
    
    try {
      const { error } = await supabaseService.signInWithGoogle();
      
      if (error) {
        console.error('Google sign in error:', error.message);
      }
      // Note: The actual authentication will happen via redirect
      // User state will be updated in the callback
    } catch (error) {
      console.error('Google sign in error:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  signInWithFacebook: async () => {
    set({ loading: true });
    
    try {
      const { error } = await supabaseService.signInWithFacebook();
      
      if (error) {
        console.error('Facebook sign in error:', error.message);
      }
      // Note: The actual authentication will happen via redirect
    } catch (error) {
      console.error('Facebook sign in error:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  signInWithApple: async () => {
    set({ loading: true });
    
    try {
      const { error } = await supabaseService.signInWithApple();
      
      if (error) {
        console.error('Apple sign in error:', error.message);
      }
      // Note: The actual authentication will happen via redirect
    } catch (error) {
      console.error('Apple sign in error:', error);
    } finally {
      set({ loading: false });
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