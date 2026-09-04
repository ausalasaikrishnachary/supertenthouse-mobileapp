export type ProductAddon = {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string;
  imageUrl: string;
};

// Consume only the selected product's associations, never the global add-on list.
export function normalizeProductAddons(value: unknown): ProductAddon[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.flatMap((item): ProductAddon[] => {
    if (!item || typeof item !== 'object') return [];
    const id = String(item.id ?? '');
    const name = String(item.name ?? item.addon_name ?? '').trim();
    const price = Number(item.price);
    if (!id || !name || seen.has(id) || !Number.isFinite(price) || price < 0) return [];
    if (item.is_active !== undefined && ![true, 1, '1'].includes(item.is_active)) return [];
    seen.add(id);
    return [{ id, name, price, description: String(item.description ?? ''), icon: String(item.icon ?? ''), imageUrl: String(item.image_url ?? '') }];
  });
}
