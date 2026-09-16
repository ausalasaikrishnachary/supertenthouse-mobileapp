import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, ReactNode } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/services/api';
import { appStorage } from '@/utils/storage';

export type WishlistItemType = 'product' | 'package';
export type WishlistEntry = { id: string; type: WishlistItemType };
type WishlistState = { entries: WishlistEntry[]; productIds: string[]; isHydrated: boolean };
type Action =
  | { type: 'SET'; payload: WishlistEntry[] }
  | { type: 'TOGGLE'; payload: WishlistEntry }
  | { type: 'REMOVE'; payload: WishlistEntry }
  | { type: 'CLEAR' }
  | { type: 'HYDRATED' };

const keyOf = (entry: WishlistEntry) => `${entry.type}:${entry.id}`;
const normalizeType = (value: unknown): WishlistItemType => value === 'package' ? 'package' : 'product';
const normalizeEntries = (value: unknown): WishlistEntry[] => {
  if (!Array.isArray(value)) return [];
  const entries = value.map((item): WishlistEntry | null => {
    if (typeof item === 'string' || typeof item === 'number') return { id: String(item), type: 'product' };
    if (!item || typeof item !== 'object') return null;
    const row = item as any;
    // API rows contain both a wishlist row `id` and the actual item ID.
    // Always prefer the explicit item fields; local entries use `id` as fallback.
    const id = row.item_id ?? row.product_id ?? row.productId ?? row.id;
    return id == null ? null : { id: String(id), type: normalizeType(row.type ?? row.item_type ?? row.itemType) };
  }).filter((item): item is WishlistEntry => Boolean(item));
  return Array.from(new Map(entries.map(entry => [keyOf(entry), entry])).values());
};
const stateFrom = (entries: WishlistEntry[], isHydrated = true): WishlistState => ({
  entries,
  productIds: entries.filter(entry => entry.type === 'product').map(entry => entry.id),
  isHydrated,
});
const initialState = stateFrom([], false);
function reducer(state: WishlistState, action: Action): WishlistState {
  if (action.type === 'HYDRATED') return { ...state, isHydrated: true };
  if (action.type === 'SET') return stateFrom(normalizeEntries(action.payload));
  if (action.type === 'CLEAR') return stateFrom([]);
  if (action.type === 'REMOVE') return stateFrom(state.entries.filter(entry => keyOf(entry) !== keyOf(action.payload)));
  if (action.type === 'TOGGLE') {
    const exists = state.entries.some(entry => keyOf(entry) === keyOf(action.payload));
    return stateFrom(exists ? state.entries.filter(entry => keyOf(entry) !== keyOf(action.payload)) : [...state.entries, action.payload]);
  }
  return state;
}

type ContextValue = {
  state: WishlistState;
  toggle: (id: string, customerId?: string, itemData?: any, itemType?: WishlistItemType) => Promise<void>;
  remove: (id: string, itemType?: WishlistItemType) => void;
  has: (id: string, itemType?: WishlistItemType) => boolean;
  fetchWishlist: (customerId: string) => Promise<WishlistEntry[]>;
  syncWishlist: (customerId: string) => Promise<void>;
  clearWishlist: (customerId: string) => Promise<void>;
};
const WishlistContext = createContext<ContextValue | undefined>(undefined);
const STORAGE_KEY = 'wishlist_state';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      const saved = await appStorage.getItem(STORAGE_KEY);
      if (saved) {
        try { dispatch({ type: 'SET', payload: normalizeEntries(JSON.parse(saved)) }); } catch {}
      }
      dispatch({ type: 'HYDRATED' });
    })();
  }, []);

  useEffect(() => {
    if (state.isHydrated) appStorage.setItem(STORAGE_KEY, JSON.stringify(state.entries));
  }, [state.entries, state.isHydrated]);

  const has = useCallback((id: string, itemType: WishlistItemType = 'product') =>
    state.entries.some(entry => keyOf(entry) === `${itemType}:${String(id)}`), [state.entries]);

  const fetchWishlist = useCallback(async (customerId: string) => {
    if (!customerId) return [];
    const response = await axios.get(`${API_BASE_URL}/wishlist/${customerId}`);
    if (!response.data?.success || !Array.isArray(response.data.data)) throw new Error('Invalid wishlist response');
    const entries = normalizeEntries(response.data.data);
    dispatch({ type: 'SET', payload: entries });
    return entries;
  }, []);

  const toggle = useCallback(async (id: string, customerId?: string, itemData?: any, itemType: WishlistItemType = 'product') => {
    const entry = { id: String(id), type: itemType };
    const exists = state.entries.some(current => keyOf(current) === keyOf(entry));
    dispatch({ type: 'TOGGLE', payload: entry });
    if (!customerId) return;
    try {
      if (exists) {
        await axios.delete(`${API_BASE_URL}/wishlist/remove`, { params: { customerId, productId: entry.id, itemType } });
      } else {
        await axios.post(`${API_BASE_URL}/wishlist/add`, {
          customerId, productId: entry.id, itemType,
          productName: itemData?.name || '', price: itemData?.price || 0, image: itemData?.image || '',
        });
      }
    } catch (error) {
      dispatch({ type: 'TOGGLE', payload: entry });
      throw error;
    }
  }, [state.entries]);

  const remove = useCallback((id: string, itemType: WishlistItemType = 'product') => {
    dispatch({ type: 'REMOVE', payload: { id: String(id), type: itemType } });
  }, []);

  const syncWishlist = useCallback(async (customerId: string) => {
    for (const entry of state.entries) {
      await axios.post(`${API_BASE_URL}/wishlist/add`, { customerId, productId: entry.id, itemType: entry.type });
    }
  }, [state.entries]);

  const clearWishlist = useCallback(async (customerId: string) => {
    await Promise.all(state.entries.map(entry => axios.delete(`${API_BASE_URL}/wishlist/remove`, {
      params: { customerId, productId: entry.id, itemType: entry.type },
    })));
    dispatch({ type: 'CLEAR' });
  }, [state.entries]);

  const value = useMemo(() => ({ state, toggle, remove, has, fetchWishlist, syncWishlist, clearWishlist }),
    [state, toggle, remove, has, fetchWishlist, syncWishlist, clearWishlist]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const value = useContext(WishlistContext);
  if (!value) throw new Error('useWishlist must be used within WishlistProvider');
  return value;
}
