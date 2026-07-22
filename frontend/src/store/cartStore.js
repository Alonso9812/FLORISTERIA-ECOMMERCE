import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        const items = get().items;
        const exists = items.find(i => i.id === product.id);
        
        if (exists) {
          set({
            items: items.map(i => 
              i.id === product.id 
                ? { ...i, quantity: i.quantity + 1 } 
                : i
            )
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter(i => i.id !== id) });
      },

      updateQuantity: (id, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter(i => i.id !== id) });
        } else {
          set({
            items: get().items.map(i => 
              i.id === id ? { ...i, quantity: qty } : i
            )
          });
        }
      },

      clearCart: () => set({ items: [] }),

      get total() {
        return get().items.reduce((sum, i) => sum + (parseFloat(i.price) * i.quantity), 0);
      },

      get itemCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      }
    }),
    { name: 'floristeria-cart' }
  )
);