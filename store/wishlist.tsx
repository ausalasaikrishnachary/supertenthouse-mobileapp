// store/wishlist.tsx
import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { API_BASE_URL } from '@/services/api';
import axios from 'axios';

type WishlistState = {
  productIds: string[];
};

type WishlistAction =
  | { type: 'TOGGLE'; payload: string }
  | { type: 'REMOVE'; payload: string }
  | { type: 'SET'; payload: string[] }
  | { type: 'CLEAR' };

const initialState: WishlistState = { productIds: [] };

function reducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'SET':
      return { productIds: action.payload };
    case 'TOGGLE':
      return {
        productIds: state.productIds.includes(action.payload)
          ? state.productIds.filter((id) => id !== action.payload)
          : [...state.productIds, action.payload],
      };
    case 'REMOVE':
      return { productIds: state.productIds.filter((id) => id !== action.payload) };
    case 'CLEAR':
      return { productIds: [] };
    default:
      return state;
  }
}

type WishlistContextType = {
  state: WishlistState;
  toggle: (productId: string, customerId?: string, productData?: any) => Promise<void>;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
  fetchWishlist: (customerId: string) => Promise<void>;
  syncWishlist: (customerId: string) => Promise<void>;
  clearWishlist: (customerId: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = 'wishlist_state';

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  return null;
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ─── Load from storage on mount ──────────────────────────────────────────────
  useEffect(() => {
    const s = getStorage();
    if (s) {
      const saved = s.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed)) {
            dispatch({ type: 'SET', payload: parsed });
          }
        } catch {}
      }
    }
  }, []);

  // ─── Save to storage on change ──────────────────────────────────────────────
  useEffect(() => {
    const s = getStorage();
    if (s) {
      s.setItem(STORAGE_KEY, JSON.stringify(state.productIds));
    }
  }, [state.productIds]);

  // ─── Fetch wishlist from backend ─────────────────────────────────────────────
  const fetchWishlist = useCallback(async (customerId: string) => {
    if (!customerId) {
      console.log('📦 No customerId provided to fetchWishlist');
      return;
    }
    
    try {
      console.log('📦 Fetching wishlist from backend for customer:', customerId);
      const response = await axios.get(`${API_BASE_URL}/wishlist/${customerId}`);
      
      console.log('📦 Wishlist response:', response.data);
      
      if (response.data.success && response.data.data) {
        const productIds = response.data.data.map((item: any) => String(item.product_id));
        dispatch({ type: 'SET', payload: productIds });
        console.log('📦 Wishlist fetched:', productIds.length, 'items');
      } else {
        dispatch({ type: 'SET', payload: [] });
      }
    } catch (error: any) {
      console.error('❌ Failed to fetch wishlist:', error);
      console.error('Error details:', error.response?.data || error.message);
      dispatch({ type: 'SET', payload: [] });
    }
  }, []);

  // ─── Toggle wishlist item - FIXED ────────────────────────────────────────────
 // ─── Toggle wishlist item - FIXED ────────────────────────────────────────────
const toggle = useCallback(async (productId: string, customerId?: string, productData?: any) => {
  console.log('🔄 Toggling wishlist:', { productId, customerId, productData });
  console.log('📦 Current wishlist state:', state.productIds);
  
  const isInWishlist = state.productIds.includes(productId);
  console.log('📦 Is in wishlist:', isInWishlist);
  
  dispatch({ type: 'TOGGLE', payload: productId });
  console.log('📦 Local state toggled');
  
  if (customerId) {
    try {
      if (isInWishlist) {
        // Remove from wishlist using query params
        console.log('🗑️ Removing from wishlist backend:', { customerId, productId });
        const deleteResponse = await axios.delete(`${API_BASE_URL}/wishlist/remove`, {
          params: { customerId, productId }
        });
        console.log('✅ Removed from wishlist backend:', deleteResponse.data);
      } else {
        // Add to wishlist with product details
        console.log('✅ Adding to wishlist backend:', { 
          customerId, 
          productId,
          productData 
        });
        
        const addResponse = await axios.post(`${API_BASE_URL}/wishlist/add`, {
          customerId,
          productId,
          productName: productData?.name || '',
          price: productData?.price || 0,
          image: productData?.image || '',
        });
        console.log('✅ Added to wishlist backend:', addResponse.data);
      }
    } catch (error: any) {
      console.error('❌ Failed to sync wishlist with backend:', error);
      console.error('Error details:', error.response?.data || error.message);
      dispatch({ type: 'TOGGLE', payload: productId });
      throw error;
    }
  } else {
    console.log('📦 No customerId, local toggle only');
  }
}, [state.productIds]);

  // ─── Remove from wishlist (local only) ──────────────────────────────────────
  const remove = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE', payload: productId });
  }, []);

  // ─── Check if product is in wishlist ────────────────────────────────────────
  const has = useCallback((productId: string) => {
    return state.productIds.includes(productId);
  }, [state.productIds]);

  // ─── Sync wishlist with backend ─────────────────────────────────────────────
  const syncWishlist = useCallback(async (customerId: string) => {
    if (!customerId) {
      console.log('📦 No customerId provided to syncWishlist');
      return;
    }
    
    if (state.productIds.length === 0) {
      console.log('📦 Wishlist is empty, nothing to sync');
      return;
    }
    
    try {
      console.log('📦 Syncing wishlist with backend:', state.productIds);
      
      for (const productId of state.productIds) {
        await axios.post(`${API_BASE_URL}/wishlist/add`, {
          customerId,
          productId,
        });
      }
      console.log('✅ Wishlist synced with backend');
    } catch (error: any) {
      console.error('❌ Failed to sync wishlist:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  }, [state.productIds]);

  // ─── Clear wishlist ──────────────────────────────────────────────────────────
  const clearWishlist = useCallback(async (customerId: string) => {
    if (!customerId) {
      console.log('📦 No customerId provided to clearWishlist');
      return;
    }
    
    try {
      console.log('🗑️ Clearing wishlist for customer:', customerId);
      
      // Remove all items one by one
      for (const productId of state.productIds) {
        await axios.delete(`${API_BASE_URL}/wishlist/remove`, {
          data: { customerId, productId },
        });
      }
      
      dispatch({ type: 'CLEAR' });
      console.log('✅ Wishlist cleared from backend and local');
    } catch (error: any) {
      console.error('❌ Failed to clear wishlist:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  }, [state.productIds]);

  return (
    <WishlistContext.Provider
      value={{
        state,
        toggle,
        remove,
        has,
        fetchWishlist,
        syncWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}