import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Toy {
  id: string;
  name: string;
  description: string;
  ageGroup: string;
  category: string;
  imageUrl: string;
  brand: string;
  price: number;
}

export interface Plan {
  id: string;
  name: string;
  toysPerMonth: number;
  price: number;
  features: string[];
  popular?: boolean;
}

export interface CartItem {
  toy: Toy;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  selectedPlan: Plan | null;
  selectedAgeGroup: string | null;
  addToCart: (toy: Toy) => void;
  removeFromCart: (toyId: string) => void;
  updateQuantity: (toyId: string, quantity: number) => void;
  clearCart: () => void;
  selectPlan: (plan: Plan) => void;
  setAgeGroup: (ageGroup: string) => void;
  getTotalPrice: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedPlan: null,
      selectedAgeGroup: null,
      
      addToCart: (toy: Toy) => {
        const { items } = get();
        const existingItem = items.find(item => item.toy.id === toy.id);
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.toy.id === toy.id 
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          set({ items: [...items, { toy, quantity: 1 }] });
        }
      },
      
      removeFromCart: (toyId: string) => {
        set({
          items: get().items.filter(item => item.toy.id !== toyId)
        });
      },
      
      updateQuantity: (toyId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(toyId);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.toy.id === toyId 
              ? { ...item, quantity }
              : item
          )
        });
      },
      
      clearCart: () => {
        set({ items: [] });
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
    }),
    {
      name: 'cart-storage',
    }
  )
);