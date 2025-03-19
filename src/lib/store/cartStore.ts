import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Warenkorb-Artikeltyp
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

// Warenkorbzustandstyp
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  
  // Aktionen
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // Hilfsfunktionen
  getItemQuantity: (id: string) => number;
  isItemInCart: (id: string) => boolean;
}

// Erstelle den Warenkorb-Store mit Persistenz (localStorage)
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      
      // Artikel zum Warenkorb hinzufügen oder Menge aktualisieren, wenn bereits vorhanden
      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        
        if (existingItem) {
          // Wenn der Artikel bereits im Warenkorb ist, erhöhe die Menge
          return {
            ...state,
            items: state.items.map((i) => 
              i.id === item.id 
                ? { ...i, quantity: i.quantity + 1 } 
                : i
            ),
            totalItems: state.totalItems + 1,
            totalPrice: state.totalPrice + item.price,
          };
        }
        
        // Wenn der Artikel noch nicht im Warenkorb ist, füge ihn hinzu
        return {
          ...state,
          items: [...state.items, { ...item, quantity: 1 }],
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + item.price,
        };
      }),
      
      // Artikel aus dem Warenkorb entfernen
      removeItem: (id) => set((state) => {
        const itemToRemove = state.items.find((item) => item.id === id);
        
        if (!itemToRemove) return state;
        
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
          totalItems: state.totalItems - itemToRemove.quantity,
          totalPrice: state.totalPrice - (itemToRemove.price * itemToRemove.quantity),
        };
      }),
      
      // Artikelmenge aktualisieren
      updateQuantity: (id, quantity) => set((state) => {
        const item = state.items.find((i) => i.id === id);
        
        if (!item) return state;
        
        const quantityDiff = quantity - item.quantity;
        
        return {
          ...state,
          items: state.items.map((i) => 
            i.id === id ? { ...i, quantity } : i
          ),
          totalItems: state.totalItems + quantityDiff,
          totalPrice: state.totalPrice + (quantityDiff * item.price),
        };
      }),
      
      // Warenkorb leeren
      clearCart: () => set({ 
        items: [], 
        totalItems: 0, 
        totalPrice: 0 
      }),
      
      // Artikelmenge abrufen
      getItemQuantity: (id) => {
        const item = get().items.find((i) => i.id === id);
        return item ? item.quantity : 0;
      },
      
      // Prüfen, ob ein Artikel im Warenkorb ist
      isItemInCart: (id) => {
        return get().items.some((i) => i.id === id);
      },
    }),
    {
      name: 'wowweb-cart',
      // Speichere nur die Artikel im localStorage
      partialize: (state) => ({ items: state.items }),
      // Bei Wiederherstellung des Zustands die totalItems und totalPrice neu berechnen
      onRehydrateStorage: () => (state) => {
        if (state && state.items) {
          const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
          const totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          
          state.totalItems = totalItems;
          state.totalPrice = totalPrice;
        }
      },
    }
  )
); 