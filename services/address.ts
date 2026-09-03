// services/address.ts
import axios from 'axios';
import { API_BASE_URL } from './api';

export type Address = {
  id: string;
  customerId: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  type: 'home' | 'office' | 'other';
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AddressInput = Omit<Address, 'id' | 'customerId' | 'createdAt' | 'updatedAt'>;

export type Order = {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  address: {
    id?: string;
    label?: string;
    fullName?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  eventDate?: string;
  eventTime?: string;
  eventType?: string;
  venue?: string;
  guestCount?: number;
  specialInstructions?: string;
  items: any[];
  subtotal: number;
  deliveryCharge: number;
  gst: number;
  couponDiscount: number;
  couponCode?: string;
  grandTotal: number;
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'confirmed' | 'team_assigned' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type OrderInput = {
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  address: {
    id?: string;
    label?: string;
    fullName?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  eventDate?: string;
  eventTime?: string;
  eventType?: string;
  venue?: string;
  guestCount?: number;
  specialInstructions?: string;
  items: any[];
  subtotal: number;
  deliveryCharge: number;
  gst: number;
  couponDiscount: number;
  couponCode?: string;
  grandTotal: number;
  paymentMethod?: string;
  notes?: string;
};

// ─── Address Service Class ────────────────────────────────────────────────────
class AddressService {
  // ─── Get all addresses for a customer ──────────────────────────────────────
  async getAddresses(customerId: string): Promise<Address[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/checkout/addresses/${customerId}`);
      if (response.data.success) {
        return response.data.data.map((addr: any) => ({
          id: String(addr.id),
          customerId: String(addr.customer_id),
          label: addr.label,
          fullName: addr.full_name,
          phone: addr.phone,
          line1: addr.line1,
          line2: addr.line2 || '',
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
          country: addr.country || 'India',
          type: addr.type || 'other',
          isDefault: addr.is_default === 1,
          createdAt: addr.created_at,
          updatedAt: addr.updated_at,
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      return [];
    }
  }

  // ─── Add new address ──────────────────────────────────────────────────────
  async addAddress(customerId: string, address: AddressInput): Promise<Address | null> {
    try {
      const response = await axios.post(`${API_BASE_URL}/checkout/address`, {
        customerId,
        label: address.label,
        fullName: address.fullName,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2 || '',
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country || 'India',
        type: address.type || 'other',
        isDefault: address.isDefault || false,
      });
      
      if (response.data.success) {
        return {
          id: String(response.data.data.id),
          customerId,
          ...address,
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to add address:', error);
      return null;
    }
  }

  // ─── Update address ──────────────────────────────────────────────────────
  async updateAddress(addressId: string, address: Partial<AddressInput>): Promise<boolean> {
    try {
      const response = await axios.put(`${API_BASE_URL}/checkout/address/${addressId}`, address);
      return response.data.success;
    } catch (error) {
      console.error('Failed to update address:', error);
      return false;
    }
  }

  // ─── Delete address ──────────────────────────────────────────────────────
  async deleteAddress(addressId: string): Promise<boolean> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/checkout/address/${addressId}`);
      return response.data.success;
    } catch (error) {
      console.error('Failed to delete address:', error);
      return false;
    }
  }

  // ─── Set default address ──────────────────────────────────────────────────
  async setDefaultAddress(addressId: string): Promise<boolean> {
    try {
      const response = await axios.put(`${API_BASE_URL}/checkout/address/default/${addressId}`);
      return response.data.success;
    } catch (error) {
      console.error('Failed to set default address:', error);
      return false;
    }
  }

  // ─── Get default address ──────────────────────────────────────────────────
  async getDefaultAddress(customerId: string): Promise<Address | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/checkout/address/default/${customerId}`);
      if (response.data.success && response.data.data) {
        const addr = response.data.data;
        return {
          id: String(addr.id),
          customerId: String(addr.customer_id),
          label: addr.label,
          fullName: addr.full_name,
          phone: addr.phone,
          line1: addr.line1,
          line2: addr.line2 || '',
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
          country: addr.country || 'India',
          type: addr.type || 'other',
          isDefault: addr.is_default === 1,
          createdAt: addr.created_at,
          updatedAt: addr.updated_at,
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to get default address:', error);
      return null;
    }
  }
}

// ─── Order Service Class ─────────────────────────────────────────────────────
class OrderService {
  // ─── Create order ──────────────────────────────────────────────────────────
  async createOrder(orderData: OrderInput): Promise<Order | null> {
    try {
      console.log('📦 OrderService.createOrder called with:', orderData);
      const response = await axios.post(`${API_BASE_URL}/checkout/order`, orderData);
      console.log('📦 OrderService.createOrder response:', response.data);
      
      if (response.data.success) {
        return {
          ...response.data.data.order,
          id: String(response.data.data.id),
          orderNumber: response.data.data.orderNumber,
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to create order:', error);
      return null;
    }
  }

  // ─── Get orders by customer ───────────────────────────────────────────────
  async getOrders(customerId: string): Promise<Order[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/checkout/orders/${customerId}`);
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      return [];
    }
  }

  // ─── Get order by order number ────────────────────────────────────────────
  async getOrder(orderNumber: string): Promise<Order | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/checkout/order/${orderNumber}`);
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch order:', error);
      return null;
    }
  }

  // ─── Update order status ──────────────────────────────────────────────────
  async updateOrderStatus(orderId: string, status: { orderStatus?: string; paymentStatus?: string }): Promise<boolean> {
    try {
      const response = await axios.put(`${API_BASE_URL}/checkout/order/${orderId}/status`, status);
      return response.data.success;
    } catch (error) {
      console.error('Failed to update order status:', error);
      return false;
    }
  }
}

// ─── Create instances and export ─────────────────────────────────────────────
export const addressService = new AddressService();
export const orderService = new OrderService();

// ─── Default export for backward compatibility ──────────────────────────────
export default {
  addressService,
  orderService,
};