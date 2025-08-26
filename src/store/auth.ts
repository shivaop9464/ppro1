import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        // Check if we're on the client side
        if (typeof window === 'undefined') {
          return false;
        }
        
        // Mock authentication - check localStorage for existing users
        let users = JSON.parse(localStorage.getItem('playpro_users') || '[]');
        
        // Initialize default users if localStorage is empty
        if (users.length === 0) {
          users = [
            {
              id: '1',
              name: 'Demo User',
              email: 'demo@playpro.com',
              password: 'demo123',
              isAdmin: false
            },
            {
              id: '2',
              name: 'Admin User',
              email: 'admin@playpro.com',
              password: 'admin123',
              isAdmin: true
            }
          ];
          localStorage.setItem('playpro_users', JSON.stringify(users));
        }
        
        const user = users.find((u: any) => u.email === email && u.password === password);
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ 
            user: userWithoutPassword, 
            isAuthenticated: true 
          });
          return true;
        }
        return false;
      },
      
      signup: async (name: string, email: string, password: string) => {
        // Check if we're on the client side
        if (typeof window === 'undefined') {
          return false;
        }
        
        // Mock signup - store in localStorage
        let users = JSON.parse(localStorage.getItem('playpro_users') || '[]');
        
        // Initialize default users if localStorage is empty
        if (users.length === 0) {
          users = [
            {
              id: '1',
              name: 'Demo User',
              email: 'demo@playpro.com',
              password: 'demo123',
              isAdmin: false
            },
            {
              id: '2',
              name: 'Admin User',
              email: 'admin@playpro.com',
              password: 'admin123',
              isAdmin: true
            }
          ];
          localStorage.setItem('playpro_users', JSON.stringify(users));
        }
        
        // Check if user already exists
        if (users.find((u: any) => u.email === email)) {
          return false;
        }
        
        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          password,
          isAdmin: email === 'admin@playpro.com'
        };
        
        users.push(newUser);
        localStorage.setItem('playpro_users', JSON.stringify(users));
        
        const { password: _, ...userWithoutPassword } = newUser;
        set({ 
          user: userWithoutPassword, 
          isAuthenticated: true 
        });
        return true;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);