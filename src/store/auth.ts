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
  // Fallback auth methods
  loginFallback: (email: string, password: string) => Promise<boolean>;
}

// Default users for fallback authentication
const DEFAULT_USERS = [
  {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@playpro.com',
    password: 'admin123',
    isAdmin: true
  },
  {
    id: 'demo-001',
    name: 'Demo User',
    email: 'demo@playpro.com',
    password: 'demo123',
    isAdmin: false
  }
];

// Initialize default users in localStorage if empty
const initializeDefaultUsers = () => {
  if (typeof window === 'undefined') return;
  
  const existingUsers = localStorage.getItem('playpro_users');
  if (!existingUsers) {
    localStorage.setItem('playpro_users', JSON.stringify(DEFAULT_USERS));
    console.log('Initialized default users for fallback authentication');
  }
};

// Fallback authentication using localStorage
const authenticateWithFallback = (email: string, password: string): User | null => {
  if (typeof window === 'undefined') return null;
  
  const users = JSON.parse(localStorage.getItem('playpro_users') || '[]');
  const user = users.find((u: any) => u.email === email && u.password === password);
  
  if (user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    };
  }
  
  return null;
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,
  
  initialize: async () => {
    if (get().initialized) return;
    
    // Initialize default users for fallback
    initializeDefaultUsers();
    
    set({ loading: true });
    
    try {
      // Always check for fallback authentication in localStorage first
      const fallbackUser = localStorage.getItem('playpro_current_user');
      if (fallbackUser) {
        const user = JSON.parse(fallbackUser);
        set({
          user,
          isAuthenticated: true,
          loading: false,
          initialized: true
        });
        return;
      }
      
      // Check if Supabase is configured and user is already logged in
      if (supabase) {
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
              isAuthenticated: true,
              loading: false,
              initialized: true
            });
            return;
          } else {
            // If we can't get user profile, still consider user authenticated
            // but with minimal information
            set({
              user: {
                id: session.user.id,
                name: session.user.user_metadata?.name || 'User',
                email: session.user.email || '',
                isAdmin: false
              },
              isAuthenticated: true,
              loading: false,
              initialized: true
            });
            return;
          }
        }
      }
      
      // If no authentication found, ensure state is clean
      set({ 
        user: null, 
        isAuthenticated: false, 
        loading: false, 
        initialized: true 
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      console.log('Falling back to localStorage authentication');
      
      // Check for fallback authentication
      const fallbackUser = localStorage.getItem('playpro_current_user');
      if (fallbackUser) {
        const user = JSON.parse(fallbackUser);
        set({
          user,
          isAuthenticated: true,
          loading: false,
          initialized: true
        });
      } else {
        set({ 
          user: null, 
          isAuthenticated: false, 
          loading: false, 
          initialized: true 
        });
      }
    }
  },
  
  loginFallback: async (email: string, password: string) => {
    set({ loading: true });
    
    try {
      const user = authenticateWithFallback(email, password);
      
      if (user) {
        // Store current user in localStorage
        localStorage.setItem('playpro_current_user', JSON.stringify(user));
        
        set({
          user,
          isAuthenticated: true,
          loading: false
        });
        return true;
      }
      
      set({ loading: false });
      return false;
    } catch (error) {
      console.error('Fallback login error:', error);
      set({ loading: false });
      return false;
    }
  },
  
  checkSession: async () => {
    try {
      // Always check localStorage first
      const fallbackUser = localStorage.getItem('playpro_current_user');
      if (fallbackUser) {
        const user = JSON.parse(fallbackUser);
        set({
          user,
          isAuthenticated: true
        });
        return;
      }
      
      // Only check Supabase session if Supabase is configured
      if (supabase) {
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
          } else {
            // If we can't get user profile, still consider user authenticated
            set({
              user: {
                id: session.user.id,
                name: session.user.user_metadata?.name || 'User',
                email: session.user.email || '',
                isAdmin: false
              },
              isAuthenticated: true
            });
          }
        } else {
          set({ user: null, isAuthenticated: false });
        }
      } else {
        // For fallback authentication, check localStorage
        const fallbackUser = localStorage.getItem('playpro_current_user');
        if (fallbackUser) {
          const user = JSON.parse(fallbackUser);
          set({
            user,
            isAuthenticated: true
          });
        } else {
          set({ user: null, isAuthenticated: false });
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
      set({ user: null, isAuthenticated: false });
    }
  },
  
  login: async (email: string, password: string) => {
    set({ loading: true });
    
    try {
      // Always try fallback authentication first for demo users
      const fallbackResult = await get().loginFallback(email, password);
      if (fallbackResult) {
        set({ loading: false });
        return true;
      }
      
      // Check if Supabase is configured
      if (!supabase) {
        console.log('Supabase not configured, using fallback authentication');
        set({ loading: false });
        return false;
      }
      
      // Try using the login API route
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        set({
          user: result.user,
          isAuthenticated: true,
          loading: false
        });
        return true;
      }
      
      console.log('API login failed:', result.error);
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
      // Check if user already exists in fallback storage
      if (typeof window !== 'undefined') {
        const existingUsers = JSON.parse(localStorage.getItem('playpro_users') || '[]');
        const userExists = existingUsers.find((u: any) => u.email === email);
        
        if (userExists) {
          set({ loading: false });
          console.error('User already exists with this email');
          return false;
        }
      }
      
      // Use the new signup API route
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        console.error('Signup failed:', result.error);
        set({ loading: false });
        return false;
      }
      
      // If fallback mode, store user in localStorage
      if (result.fallback && typeof window !== 'undefined') {
        const existingUsers = JSON.parse(localStorage.getItem('playpro_users') || '[]');
        const newUser = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          password: password, // In production, this should be hashed
          isAdmin: result.user.isAdmin || false
        };
        
        existingUsers.push(newUser);
        localStorage.setItem('playpro_users', JSON.stringify(existingUsers));
        localStorage.setItem('playpro_current_user', JSON.stringify(result.user));
        
        console.log('User stored in fallback localStorage');
      }
      
      // Set user in state
      set({
        user: result.user,
        isAuthenticated: true,
        loading: false
      });
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      set({ loading: false });
      return false;
    }
  },
  
  logout: async () => {
    set({ loading: true });
    
    try {
      // Try Supabase logout
      if (supabase) {
        const { error } = await supabaseService.signOut();
        
        if (error) {
          console.error('Supabase logout error:', error.message);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Always clear fallback authentication data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('playpro_current_user');
    }
    
    set({ 
      user: null, 
      isAuthenticated: false, 
      loading: false 
    });
  }

}));

// Initialize auth state when the store is created
if (typeof window !== 'undefined') {
  // Ensure default users are always initialized
  initializeDefaultUsers();
  
  useAuthStore.getState().initialize();
  
  // Listen for auth changes only if Supabase is configured
  if (supabase) {
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
}