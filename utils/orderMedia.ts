import { API_BASE_URL } from '@/constants/api';

export function resolveOrderImage(value?: string | null): string {
  const image = String(value || '').trim().replace(/\\/g, '/');
  if (!image) return '';
  if (/^(https?:|data:|blob:)/i.test(image)) return image;
  const mediaBase = API_BASE_URL.replace(/\/api\/?$/i, '');
  return `${mediaBase}/${image.replace(/^\/+/, '')}`;
}

export function formatOrderAddress(order: Record<string, unknown>): string[] {
  const cityLine = [order.address_city, order.address_state].filter(Boolean).join(', ')
    + (order.address_pincode ? `${order.address_city || order.address_state ? ' - ' : ''}${order.address_pincode}` : '');
  return [order.address_line1, order.address_line2, cityLine, order.address_country || 'India']
    .map(value => String(value || '').trim()).filter(Boolean);
}
