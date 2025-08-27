import { create } from 'zustand';
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
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated || !user) {
      set({ items: [] });
      return;
    }
    
    set({ loading: true });
    
    try {
      const response = await fetch(`/api/cart-admin?userId=${user.id}`);
      const result = await response.json();
      
      if (result.success && result.items) {
        const items: CartItem[] = result.items.map((item: any) => ({
          toy: item.toy,
          quantity: item.quantity
        }));
        
        set({ items });
      } else {
        set({ items: [] });
      }
    } catch (error) {
      console.error('Error syncing cart from API:', error);
      set({ items: [] });
    } finally {
      set({ loading: false });
    }
  },
  
  addToCart: async (toy: Toy) => {
    const { isAuthenticated, user } = useAuthStore.getState();
    
    if (!isAuthenticated || !user) {
      console.warn('User must be logged in to add items to cart');
      return;
    }
    
    set({ loading: true });
    
    try {
      const response = await fetch('/api/cart-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add',
          userId: user.id,
          toyId: toy.id,
          quantity: 1
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh cart from API to get updated state
        await get().syncFromDatabase();
      } else {
        console.error('Failed to add to cart:', result.error);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  removeFromCart: async (toyId: string) => {
    const { isAuthenticated, user } = useAuthStore.getState();
    
    if (!isAuthenticated || !user) {
      return;
    }
    
    set({ loading: true });
    
    try {
      const response = await fetch('/api/cart-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'remove',
          userId: user.id,
          toyId: toyId
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh cart from API
        await get().syncFromDatabase();
      } else {
        console.error('Failed to remove from cart:', result.error);
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
    
    const { isAuthenticated, user } = useAuthStore.getState();
    
    if (!isAuthenticated || !user) {
      return;
    }
    
    set({ loading: true });
    
    try {
      // Find the cart item to get its ID
      const { items } = get();
      const cartItem = items.find(item => item.toy.id === toyId);
      
      if (cartItem) {
        // Get current cart to find the item ID
        const response = await fetch(`/api/cart-admin?userId=${user.id}`);
        const result = await response.json();
        
        if (result.success) {
          const dbCartItem = result.items.find((item: any) => item.toy.id === toyId);
          
          if (dbCartItem) {
            const updateResponse = await fetch('/api/cart-admin', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'update',
                userId: user.id,
                itemId: dbCartItem.id,
                quantity: quantity
              })
            });
            
            const updateResult = await updateResponse.json();
            
            if (updateResult.success) {
              // Refresh cart from API
              await get().syncFromDatabase();
            } else {
              console.error('Failed to update cart quantity:', updateResult.error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  clearCart: async () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    
    if (!isAuthenticated || !user) {
      set({ items: [] });
      return;
    }
    
    set({ loading: true });
    
    try {
      const response = await fetch('/api/cart-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'clear',
          userId: user.id
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        set({ items: [] });
      } else {
        console.error('Failed to clear cart:', result.error);
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