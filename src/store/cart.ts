import { create } from 'zustand';
import { supabaseService } from '@/lib/supabase-service';
import { useAuthStore } from './auth';

export interface Toy {
  id: string;
  name: string;
  description: string;
  age_group: string;
  category: string;
  image_url: string;
  brand: string;
  price: number;
  stock?: number;
  tags?: string[];
}

export interface Plan {
  id: string;
  name: string;
  toys_per_month: number;
  price: number;
  features: string[];
  is_popular?: boolean;
}

export interface CartItem {
  toy: Toy;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  selectedPlan: Plan | null;
  selectedAgeGroup: string | null;
  loading: boolean;
  initialized: boolean;
  addToCart: (toy: Toy) => Promise<void>;
  removeFromCart: (toyId: string) => Promise<void>;
  updateQuantity: (toyId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  selectPlan: (plan: Plan) => void;
  setAgeGroup: (ageGroup: string) => void;
  getTotalPrice: () => number;
  getCartCount: () => number;
  initialize: () => Promise<void>;
  syncFromDatabase: () => Promise<void>;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  selectedPlan: null,
  selectedAgeGroup: null,
  loading: false,
  initialized: false,
  
  initialize: async () => {
    if (get().initialized) return;
    
    const { isAuthenticated } = useAuthStore.getState();
    
    if (isAuthenticated) {
      await get().syncFromDatabase();
    }
    
    set({ initialized: true });
  },
  
  syncFromDatabase: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      set({ items: [] });
      return;
    }
    
    set({ loading: true });
    
    try {
      const { data: cartItems, error } = await supabaseService.getCartItems();
      
      if (!error && cartItems) {
        const items: CartItem[] = cartItems.map((item: any) => ({
          toy: {
            id: item.toys.id,
            name: item.toys.name,
            description: item.toys.description,
            age_group: item.toys.age_group,
            category: item.toys.category,
            image_url: item.toys.image_url,
            brand: item.toys.brand,
            price: item.toys.price,
            stock: item.toys.stock,
            tags: item.toys.tags
          },
          quantity: item.quantity
        }));
        
        set({ items });
      }
    } catch (error) {
      console.error('Error syncing cart from database:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  addToCart: async (toy: Toy) => {
    const { isAuthenticated } = useAuthStore.getState();
    
    if (!isAuthenticated) {
      console.warn('User must be logged in to add items to cart');
      return;
    }
    
    set({ loading: true });
    
    try {
      // Use addToCart method which handles quantity increment automatically
      const { error } = await supabaseService.addToCart(toy.id, 1);
      
      if (!error) {
        // Refresh cart from database to get updated state
        await get().syncFromDatabase();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  removeFromCart: async (toyId: string) => {
    const { isAuthenticated } = useAuthStore.getState();
    
    if (!isAuthenticated) {
      return;
    }
    
    set({ loading: true });
    
    try {
      // Find the cart item by toy_id
      const { items } = get();
      const cartItem = items.find(item => item.toy.id === toyId);
      
      if (cartItem) {
        // We need to get the actual cart_item.id from the database
        const { data: cartItems } = await supabaseService.getCartItems();
        const dbCartItem = cartItems?.find((item: any) => item.toys.id === toyId);
        
        if (dbCartItem) {
          const { error } = await supabaseService.removeFromCart(dbCartItem.id);
          
          if (!error) {
            // Refresh cart from database
            await get().syncFromDatabase();
          }
        }
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  updateQuantity: async (toyId: string, quantity: number) => {
    if (quantity <= 0) {
      await get().removeFromCart(toyId);
      return;
    }
    
    const { isAuthenticated } = useAuthStore.getState();
    
    if (!isAuthenticated) {
      return;
    }
    
    set({ loading: true });
    
    try {
      // Find the cart item by toy_id
      const { data: cartItems } = await supabaseService.getCartItems();
      const dbCartItem = cartItems?.find((item: any) => item.toys.id === toyId);
      
      if (dbCartItem) {
        const { error } = await supabaseService.updateCartItemQuantity(dbCartItem.id, quantity);
        
        if (!error) {
          // Refresh cart from database
          await get().syncFromDatabase();
        }
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  clearCart: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    
    if (!isAuthenticated) {
      set({ items: [] });
      return;
    }
    
    set({ loading: true });
    
    try {
      const { error } = await supabaseService.clearCart();
      
      if (!error) {
        set({ items: [] });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  selectPlan: (plan: Plan) => {
    set({ selectedPlan: plan });
  },
  
  setAgeGroup: (ageGroup: string) => {
    set({ selectedAgeGroup: ageGroup });
  },
  
  getTotalPrice: () => {
    const { items, selectedPlan } = get();
    const itemsTotal = items.reduce((total, item) => total + (item.toy.price * item.quantity), 0);
    const planPrice = selectedPlan ? selectedPlan.price : 0;
    return itemsTotal + planPrice;
  },
  
  getCartCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  }
}));