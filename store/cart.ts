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
  toysPerMonth: number;
  price: number;
  features: string[];
  popular?: boolean;
  deposit_amount?: number;
}

export interface CartItem {
  toy: Toy;
  quantity: number;
}

// New interface for address
export interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

interface CartState {
  items: CartItem[];
  selectedPlan: Plan | null;
  selectedAgeGroup: string | null;
  // New address field
  shippingAddress: Address | null;
  loading: boolean;
  initialized: boolean;
  addToCart: (toy: Toy) => Promise<void>;
  removeFromCart: (toyId: string) => Promise<void>;
  updateQuantity: (toyId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  selectPlan: (plan: Plan | null) => void;
  setAgeGroup: (ageGroup: string) => void;
  // New method for address
  setShippingAddress: (address: Address) => void;
  getTotalPrice: () => number;
  getCartCount: () => number;
  initialize: () => Promise<void>;
  syncFromDatabase: () => Promise<void>;
  // New methods for GST calculation
  getPlanPriceWithGST: () => number;
  getGSTAmount: () => number;
  // New method for monthly plan amount
  getMonthlyPlanAmount: () => number;
}

// Helper function to save selected plan to localStorage
const saveSelectedPlan = (plan: Plan | null) => {
  console.log('Saving plan to localStorage:', plan);
  if (typeof window !== 'undefined') {
    if (plan) {
      localStorage.setItem('playpro_selectedPlan', JSON.stringify(plan));
    } else {
      localStorage.removeItem('playpro_selectedPlan');
    }
  }
};

// Helper function to load selected plan from localStorage
const loadSelectedPlan = (): Plan | null => {
  if (typeof window !== 'undefined') {
    const plan = localStorage.getItem('playpro_selectedPlan');
    if (plan) {
      const parsedPlan = JSON.parse(plan);
      console.log('Loaded plan from localStorage:', parsedPlan);
      return parsedPlan;
    }
    return null;
  }
  return null;
};

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  selectedPlan: loadSelectedPlan(),
  selectedAgeGroup: null,
  // Initialize address as null
  shippingAddress: null,
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
    
    // Allow adding to cart even without authentication for plan selection
    // but still require authentication for actual checkout
    set({ loading: true });
    
    try {
      if (isAuthenticated && user) {
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
          // Instead of refreshing the entire cart, just add the item to the existing items
          const currentItems = get().items;
          const newItem: CartItem = { toy, quantity: 1 };
          set({ items: [...currentItems, newItem] });
          return;
        } else {
          console.error('Failed to add to cart:', result.error);
        }
      }
      
      // If not authenticated or API call failed, use client-side storage
      const currentItems = get().items;
      const newItem: CartItem = { toy, quantity: 1 };
      set({ items: [...currentItems, newItem] });
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Fallback to client-side storage on error
      const currentItems = get().items;
      const newItem: CartItem = { toy, quantity: 1 };
      set({ items: [...currentItems, newItem] });
    } finally {
      set({ loading: false });
    }
  },
  
  removeFromCart: async (toyId: string) => {
    const { isAuthenticated, user } = useAuthStore.getState();
    
    set({ loading: true });
    
    try {
      if (isAuthenticated && user) {
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
          // Instead of refreshing the entire cart, just remove the item from existing items
          const currentItems = get().items;
          const updatedItems = currentItems.filter(item => item.toy.id !== toyId);
          set({ items: updatedItems });
          return;
        } else {
          console.error('Failed to remove from cart:', result.error);
        }
      }
      
      // If not authenticated or API call failed, use client-side storage
      const currentItems = get().items;
      const updatedItems = currentItems.filter(item => item.toy.id !== toyId);
      set({ items: updatedItems });
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Fallback to client-side storage on error
      const currentItems = get().items;
      const updatedItems = currentItems.filter(item => item.toy.id !== toyId);
      set({ items: updatedItems });
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
      set({ items: [], selectedPlan: null });
      // Also clear from localStorage
      saveSelectedPlan(null);
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
        set({ items: [], selectedPlan: null });
        // Also clear from localStorage
        saveSelectedPlan(null);
      } else {
        console.error('Failed to clear cart:', result.error);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  selectPlan: (plan: Plan | null) => {
    console.log('Selecting plan:', plan);
    
    if (plan === null) {
      // Clear the plan
      set({ selectedPlan: null });
      saveSelectedPlan(null);
      console.log('Plan cleared from store');
      return;
    }
    
    // Make sure the plan has all required fields with correct values
    const planWithDeposit: Plan = {
      id: plan.id,
      name: plan.name,
      toysPerMonth: plan.toysPerMonth || 0,
      price: plan.price,
      features: plan.features || [],
      popular: plan.popular || false,
      deposit_amount: plan.deposit_amount || 0
    };
    
    // Ensure deposit amount and toy limits are set correctly based on plan price
    if (planWithDeposit.price === 699) {
      planWithDeposit.deposit_amount = 1000;
      planWithDeposit.toysPerMonth = planWithDeposit.toysPerMonth || 1;
    } else if (planWithDeposit.price === 1299) {
      planWithDeposit.deposit_amount = 3000;
      planWithDeposit.toysPerMonth = planWithDeposit.toysPerMonth || 3;
    } else if (planWithDeposit.price === 2199) {
      planWithDeposit.deposit_amount = 6000;
      planWithDeposit.toysPerMonth = planWithDeposit.toysPerMonth || 5;
    }
    
    console.log('Plan with deposit:', planWithDeposit);
    
    // Clear any existing items when selecting a new plan
    set({ selectedPlan: planWithDeposit, items: [] });
    
    // Save selected plan to localStorage
    saveSelectedPlan(planWithDeposit);
    
    // Log after setting the plan
    console.log('Plan set in store:', planWithDeposit);
  },
  
  setAgeGroup: (ageGroup: string) => {
    set({ selectedAgeGroup: ageGroup });
  },
  
  // New method for setting shipping address
  setShippingAddress: (address: Address) => {
    set({ shippingAddress: address });
  },
  
  getMonthlyPlanAmount: () => {
    const { selectedPlan } = get();
    console.log('Getting monthly plan amount for plan:', selectedPlan);
    if (!selectedPlan) {
      console.log('No selected plan, returning 0');
      return 0;
    }
    
    // Calculate the plan amount without GST (plan price includes 18% GST)
    // If plan price = amount without GST + 18% GST, then:
    // plan price = amount without GST * 1.18
    // amount without GST = plan price / 1.18
    const planAmountWithoutGST = selectedPlan.price / 1.18;
    return Math.round(planAmountWithoutGST * 100) / 100; // Round to 2 decimal places
  },
  
  getGSTAmount: () => {
    const { selectedPlan } = get();
    if (!selectedPlan) {
      return 0;
    }
    
    // Calculate GST as 18% of the plan amount without GST
    const planAmountWithoutGST = selectedPlan.price / 1.18;
    const gstAmount = planAmountWithoutGST * 0.18;
    return Math.round(gstAmount * 100) / 100; // Round to 2 decimal places
  },
  
  getPlanPriceWithGST: () => {
    const { selectedPlan } = get();
    console.log('Getting plan price (with GST) for plan:', selectedPlan);
    if (!selectedPlan) {
      console.log('No selected plan, returning 0');
      return 0;
    }
    
    // Return the full plan price (which already includes GST)
    return selectedPlan.price;
  },
  
  getTotalPrice: () => {
    const { items, selectedPlan } = get();
    const itemsTotal = items.reduce((total, item) => total + (item.toy.price * item.quantity), 0);
    
    console.log('Calculating total price. Items total:', itemsTotal, 'Selected plan:', selectedPlan);
    
    if (!selectedPlan) {
      console.log('No selected plan, returning items total:', itemsTotal);
      return itemsTotal;
    }
    
    // Calculate total with GST breakdown
    const planPriceWithoutGST = selectedPlan.price / 1.18;
    const gstAmount = planPriceWithoutGST * 0.18;
    const depositAmount = selectedPlan.deposit_amount || 0;
    
    const total = itemsTotal + selectedPlan.price + depositAmount;
    console.log('Plan breakdown - Plan Price (with GST):', selectedPlan.price, 'GST Amount:', gstAmount, 'Deposit:', depositAmount, 'Total:', total);
    
    return total;
  },
  
  getCartCount: () => {
    const { items, selectedPlan } = get();
    return items.length + (selectedPlan ? 1 : 0);
  }
}));