// export type Category = {
//   category_name: ReactNode;
//   id: string;
//   name: string;
//   slug: string;
//   icon: string;
//   image: string;
//   color: string;
//   productCount: number;
// };

// export type Review = {
//   id: string;
//   userName: string;
//   userAvatar: string;
//   rating: number;
//   comment: string;
//   date: string;
// };

// export type Product = {
//   id: string;
//   name: string;
//   categoryId: string;
//   categoryName: string;
//   price: number;
//   originalPrice: number;
//   discount: number;
//   rating: number;
//   reviewCount: number;
//   images: string[];
//   description: string;
//   features: string[];
//   specifications: { label: string; value: string }[];
//   colors: string[];
//   inStock: boolean;
//   stockCount: number;
//   isTrending: boolean;
//   isBestSeller: boolean;
//   isNewArrival: boolean;
//   reviews: Review[];
//   relatedIds: string[];
// };

// export type Package = {
//   id: string;
//   name: string;
//   tier: 'Basic' | 'Premium' | 'Luxury';
//   price: number;
//   originalPrice: number;
//   discount: number;
//   rating: number;
//   reviewCount: number;
//   image: string;
//   guestCapacity: number;
//   description: string;
//   includes: string[];
//   catering: boolean;
//   stageDecoration: boolean;
//   flowerDecoration: boolean;
//   lighting: boolean;
//   photography: boolean;
//   videography: boolean;
//   soundSystem: boolean;
//   djSetup: boolean;
// };

// export type AddOn = {
//   id: string;
//   name: string;
//   price: number;
//   icon: string;
// };

// export type CartItem = {
//   id: string;
//   productId: string;
//   name: string;
//   image: string;
//   price: number;
//   quantity: number;
//   type: 'product' | 'package';
//   packageId?: string;
// };

// export type Address = {
//   id: string;
//   label: string;
//   fullName: string;
//   phone: string;
//   line1: string;
//   line2?: string;
//   city: string;
//   state: string;
//   pincode: string;
//   isDefault: boolean;
// };

// export type OrderStatus = 'pending' | 'confirmed' | 'team_assigned' | 'in_progress' | 'completed' | 'cancelled';

// export type Order = {
//   id: string;
//   orderNumber: string;
//   items: CartItem[];
//   total: number;
//   subtotal: number;
//   deliveryCharge: number;
//   gst: number;
//   discount: number;
//   status: OrderStatus;
//   eventDate: string;
//   eventTime: string;
//   eventType: string;
//   venue: string;
//   guestCount: number;
//   specialInstructions?: string;
//   address: Address;
//   paymentMethod: string;
//   createdAt: string;
//   timeline: { status: OrderStatus; label: string; date: string; done: boolean }[];
// };

// export type AppNotification = {
//   id: string;
//   type: 'booking' | 'payment' | 'order' | 'team' | 'reminder' | 'offer' | 'arrival';
//   title: string;
//   message: string;
//   date: string;
//   read: boolean;
//   icon: string;
// };

// export type User = {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   avatar: string;
//   isPremium: boolean;
// };

// export type Coupon = {
//   code: string;
//   discount: number;
//   type: 'percentage' | 'flat';
//   minOrder: number;
//   description: string;
// };

// // types/index.ts
// export type Category = {
//   id: string;
//   name: string;
//   category_name: string;
//   slug: string;
//   icon: string;
//   image: string;
//   color: string;
//   productCount: number;
// };

// export type Review = {
//   id: string;
//   userName: string;
//   userAvatar: string;
//   rating: number;
//   comment: string;
//   date: string;
// };

// export type Product = {
//   id: string;
//   name: string;
//   categoryId: string;
//   categoryName: string;
//   price: number;
//   originalPrice: number;
//   discount: number;
//   rating: number;
//   reviewCount: number;
//   images: string[];
//   description: string;
//   features: string[];
//   specifications: { label: string; value: string }[];
//   colors: string[];
//   sizes: string[];
//   inStock: boolean;
//   stockCount: number;
//   soldCount: number;
//   isTrending: boolean;
//   isBestSeller: boolean;
//   isFeatured: boolean;
//   brand: string;
//   weight: string;
//   dimensions: string;
//   material: string;
//   careInstructions: string;
//   warranty: string;
//   returnPolicy: string;
//   shippingInfo: string;
//   reviews: Review[];
//   relatedIds: string[];
// };

// export type Package = {
//   id: string;
//   name: string;
//   tier: 'Basic' | 'Premium' | 'Luxury' | 'Silver' | 'Gold' | 'Platinum';
//   price: number;
//   originalPrice: number;
//   discount: number;
//   rating: number;
//   reviewCount: number;
//   image: string;
//   images?: string[];
//   guestCapacity: number;
//   description: string;
//   includes: string[];
//   catering: boolean | string[];
//   stageDecoration: boolean | string[];
//   flowerDecoration: boolean | string[];
//   lighting: boolean | string[];
//   photography: boolean | string[];
//   videography: boolean | string[];
//   soundSystem: boolean | string[];
//   djSetup?: boolean;
//   isActive: boolean;
// };

// // types/index.ts - Update the AddOn type
// export type AddOn = {
//   id: string;
//   name: string;
//   price: number;
//   icon: string;
//   description?: string; // Add this optional field
// };

// export type CartItem = {
//   id: string;
//   productId: string;
//   name: string;
//   image: string;
//   price: number;
//   quantity: number;
//   type: 'product' | 'package';
//   packageId?: string;
// };

// export type Address = {
//   id: string;
//   label: string;
//   fullName: string;
//   phone: string;
//   line1: string;
//   line2?: string;
//   city: string;
//   state: string;
//   pincode: string;
//   isDefault: boolean;
// };

// export type OrderStatus = 'pending' | 'confirmed' | 'team_assigned' | 'in_progress' | 'completed' | 'cancelled';

// export type Order = {
//   id: string;
//   orderNumber: string;
//   items: CartItem[];
//   total: number;
//   subtotal: number;
//   deliveryCharge: number;
//   gst: number;
//   discount: number;
//   status: OrderStatus;
//   eventDate: string;
//   eventTime: string;
//   eventType: string;
//   venue: string;
//   guestCount: number;
//   specialInstructions?: string;
//   address: Address;
//   paymentMethod: string;
//   createdAt: string;
//   timeline: { status: OrderStatus; label: string; date: string; done: boolean }[];
// };

// export type AppNotification = {
//   id: string;
//   type: 'booking' | 'payment' | 'order' | 'team' | 'reminder' | 'offer' | 'arrival';
//   title: string;
//   message: string;
//   date: string;
//   read: boolean;
//   icon: string;
// };

// export type User = {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   avatar: string;
//   isPremium: boolean;
// };

// export type Coupon = {
//   code: string;
//   discount: number;
//   type: 'percentage' | 'flat';
//   minOrder: number;
//   description: string;
// };

// // types/index.ts
// export type HeroBanner = {
//   id: string;
//   title: string;
//   subtitle: string;
//   image: string;
//   cta: string;
//   ctaLink: string;
//   displayOrder: number;
//   isActive: boolean;
// };


// /// types/index.ts
// export type Category = {
//   id: string;
//   name: string;
//   category_name: string;
//   slug: string;
//   icon: string;
//   image: string;
//   color: string;
//   productCount: number;
// };

// export type Review = {
//   id: string;
//   userName: string;
//   userAvatar: string;
//   rating: number;
//   comment: string;
//   date: string;
// };

// export type Product = {
//   id: string;
//   name: string;
//   categoryId: string;
//   categoryName: string;
//   price: number;
//   originalPrice: number;
//   discount: number;
//   rating: number;
//   reviewCount: number;
//   images: string[];
//   description: string;
//   features: string[];
//   specifications: Record<string, any> | { label: string; value: string }[];
//   colors: string[];
//   sizes: string[];
//   color_images?: Record<string, string[]>;
//   inStock: boolean;
//   stockCount: number;
//   soldCount: number;
//   isTrending: boolean;
//   isBestSeller: boolean;
//   isFeatured: boolean;
//   brand: string;
//   weight: string;
//   dimensions: string;
//   material: string;
//   careInstructions: string;
//   warranty: string;
//   returnPolicy: string;
//   shippingInfo: string;
//   reviews: Review[];
//   relatedIds: string[];
// };

// export type Package = {
//   id: string;
//   name: string;
//   tier: 'Basic' | 'Premium' | 'Luxury' | 'Silver' | 'Gold' | 'Platinum';
//   price: number;
//   originalPrice: number;
//   discount: number;
//   rating: number;
//   reviewCount: number;
//   image: string;
//   images?: string[];
//   guestCapacity: number;
//   description: string;
//   includes: string[];
//   catering: boolean | string[];
//   stageDecoration: boolean | string[];
//   flowerDecoration: boolean | string[];
//   lighting: boolean | string[];
//   photography: boolean | string[];
//   videography: boolean | string[];
//   soundSystem: boolean | string[];
//   djSetup?: boolean;
//   isActive: boolean;
// };

// export type AddOn = {
//   id: string;
//   name: string;
//   price: number;
//   icon: string;
//   description?: string;
// };

// export type CartItem = {
//   id: string;
//   productId: string;
//   name: string;
//   image: string;
//   price: number;
//   quantity: number;
//   type: 'product' | 'package';
//   packageId?: string;
//   selectedColor?: string;
//   selectedSize?: string;
// };

// export type Address = {
//   id: string;
//   label: string;
//   fullName: string;
//   phone: string;
//   line1: string;
//   line2?: string;
//   city: string;
//   state: string;
//   pincode: string;
//   isDefault: boolean;
// };

// export type OrderStatus = 'pending' | 'confirmed' | 'team_assigned' | 'in_progress' | 'completed' | 'cancelled';

// export type Order = {
//   id: string;
//   orderNumber: string;
//   items: CartItem[];
//   total: number;
//   subtotal: number;
//   deliveryCharge: number;
//   gst: number;
//   discount: number;
//   status: OrderStatus;
//   eventDate: string;
//   eventTime: string;
//   eventType: string;
//   venue: string;
//   guestCount: number;
//   specialInstructions?: string;
//   address: Address;
//   paymentMethod: string;
//   createdAt: string;
//   timeline: { status: OrderStatus; label: string; date: string; done: boolean }[];
// };

// export type AppNotification = {
//   id: string;
//   type: 'booking' | 'payment' | 'order' | 'team' | 'reminder' | 'offer' | 'arrival';
//   title: string;
//   message: string;
//   date: string;
//   read: boolean;
//   icon: string;
// };

// export type User = {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   avatar: string;
//   isPremium: boolean;
// };

// export type Coupon = {
//   code: string;
//   discount: number;
//   type: 'percentage' | 'flat';
//   minOrder: number;
//   description: string;
// };

// export type HeroBanner = {
//   id: string;
//   title: string;
//   subtitle: string;
//   image: string;
//   cta: string;
//   ctaLink: string;
//   displayOrder: number;
//   isActive: boolean;
// };



// // types/index.ts
// export type Category = {
//   id: string;
//   name: string;
//   category_name: string;
//   slug: string;
//   icon: string;
//   image: string;
//   color: string;
//   productCount: number;
// };

// export type Review = {
//   id: string;
//   userName: string;
//   userAvatar: string;
//   rating: number;
//   comment: string;
//   date: string;
// };

// export type Product = {
//   id: string;
//   name: string;
//   categoryId: string;
//   categoryName: string;
//   price: number;
//   originalPrice: number;
//   discount: number;
//   rating: number;
//   reviewCount: number;
//   images: string[];
//   description: string;
//   features: string[];
//   specifications: Record<string, any> | { label: string; value: string }[];
//   colors: string[];
//   sizes: string[];
//   color_images?: Record<string, string[]>;
//   inStock: boolean;
//   stockCount: number;
//   soldCount: number;
//   isTrending: boolean;
//   isBestSeller: boolean;
//   isFeatured: boolean;
//   brand: string;
//   weight: string;
//   dimensions: string;
//   material: string;
//   careInstructions: string;
//   warranty: string;
//   returnPolicy: string;
//   shippingInfo: string;
//   reviews: Review[];
//   relatedIds: string[];
// };

// export type Package = {
//   id: string;
//   name: string;
//   tier: 'Basic' | 'Premium' | 'Luxury' | 'Silver' | 'Gold' | 'Platinum';
//   price: number;
//   originalPrice: number;
//   discount: number;
//   rating: number;
//   reviewCount: number;
//   image: string;
//   images?: string[];
//   guestCapacity: number;
//   description: string;
//   includes: string[];
//   catering: boolean | string[];
//   stageDecoration: boolean | string[];
//   flowerDecoration: boolean | string[];
//   lighting: boolean | string[];
//   photography: boolean | string[];
//   videography: boolean | string[];
//   soundSystem: boolean | string[];
//   djSetup?: boolean;
//   isActive: boolean;
// };

// export type AddOn = {
//   id: string;
//   name: string;
//   price: number;
//   icon: string;
//   description?: string;
// };

// export type CartItem = {
//   id: string;
//   productId: string;
//   name: string;
//   image: string;
//   price: number;
//   quantity: number;
//   type: 'product' | 'package';
//   packageId?: string;
//   selectedColor?: string;
//   selectedSize?: string;
// };

// export type Address = {
//   id: string;
//   label: string;
//   fullName: string;
//   phone: string;
//   line1: string;
//   line2?: string;
//   city: string;
//   state: string;
//   pincode: string;
//   isDefault: boolean;
// };

// export type OrderStatus = 'pending' | 'confirmed' | 'team_assigned' | 'in_progress' | 'completed' | 'cancelled';

// export type Order = {
//   id: string;
//   orderNumber: string;
//   items: CartItem[];
//   total: number;
//   subtotal: number;
//   deliveryCharge: number;
//   gst: number;
//   discount: number;
//   status: OrderStatus;
//   eventDate: string;
//   eventTime: string;
//   eventType: string;
//   venue: string;
//   guestCount: number;
//   specialInstructions?: string;
//   address: Address;
//   paymentMethod: string;
//   createdAt: string;
//   timeline: { status: OrderStatus; label: string; date: string; done: boolean }[];
// };

// export type AppNotification = {
//   id: string;
//   type: 'booking' | 'payment' | 'order' | 'team' | 'reminder' | 'offer' | 'arrival';
//   title: string;
//   message: string;
//   date: string;
//   read: boolean;
//   icon: string;
// };

// export type User = {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   avatar: string;
//   isPremium: boolean;
//   // Address fields
//   addressLine1?: string;
//   addressLine2?: string;
//   city?: string;
//   state?: string;
//   pincode?: string;
//   country?: string;
// };

// export type Coupon = {
//   code: string;
//   discount: number;
//   type: 'percentage' | 'flat';
//   minOrder: number;
//   description: string;
// };

// export type HeroBanner = {
//   id: string;
//   title: string;
//   subtitle: string;
//   image: string;
//   cta: string;
//   ctaLink: string;
//   displayOrder: number;
//   isActive: boolean;
// };



// // types/index.ts
// export type Category = {
//   id: string;
//   name: string;
//   category_name: string;
//   slug: string;
//   icon: string;
//   image: string;
//   color: string;
//   productCount: number;
// };

// export type Review = {
//   id: string;
//   userName: string;
//   userAvatar: string;
//   rating: number;
//   comment: string;
//   date: string;
// };

// export type Product = {
//   id: string;
//   name: string;
//   categoryId: string;
//   categoryName: string;
//   price: number;
//   originalPrice: number;
//   discount: number;
//   rating: number;
//   reviewCount: number;
//   images: string[];
//   description: string;
//   features: string[];
//   specifications: Record<string, any> | { label: string; value: string }[];
//   colors: string[];
//   sizes: string[];
//   color_images?: Record<string, string[]>;
//   inStock: boolean;
//   stockCount: number;
//   soldCount: number;
//   isTrending: boolean;
//   isBestSeller: boolean;
//   isFeatured: boolean;
//   brand: string;
//   weight: string;
//   dimensions: string;
//   material: string;
//   careInstructions: string;
//   warranty: string;
//   returnPolicy: string;
//   shippingInfo: string;
//   reviews: Review[];
//   relatedIds: string[];
// };

// export type Package = {
//   id: string;
//   name: string;
//   tier: 'Basic' | 'Premium' | 'Luxury' | 'Silver' | 'Gold' | 'Platinum';
//   price: number;
//   originalPrice: number;
//   discount: number;
//   rating: number;
//   reviewCount: number;
//   image: string;
//   images?: string[];
//   guestCapacity: number;
//   description: string;
//   includes: string[];
//   catering: boolean | string[];
//   stageDecoration: boolean | string[];
//   flowerDecoration: boolean | string[];
//   lighting: boolean | string[];
//   photography: boolean | string[];
//   videography: boolean | string[];
//   soundSystem: boolean | string[];
//   djSetup?: boolean;
//   isActive: boolean;
// };

// export type AddOn = {
//   id: string;
//   name: string;
//   price: number;
//   icon: string;
//   description?: string;
//   category?: string;
//   is_default?: boolean;
//   is_active?: boolean;
// };

// // types/index.ts
// // types/index.ts - Add to CartItem type
// export type CartItem = {
//   id: string;
//   productId: string; // Make sure this exists
//   name: string;
//   image: string;
//   price: number;
//   quantity: number;
//   type: 'product' | 'package';
//   packageId?: string;
//   selectedColor?: string;
//   selectedSize?: string;
//   addons?: {
//     id: string;
//     name: string;
//     price: number;
//     icon: string;
//   }[];
// };

// export type Address = {
//   id: string;
//   label: string;
//   fullName: string;
//   phone: string;
//   line1: string;
//   line2?: string;
//   city: string;
//   state: string;
//   pincode: string;
//   isDefault: boolean;
// };

// export type OrderStatus = 'pending' | 'confirmed' | 'team_assigned' | 'in_progress' | 'completed' | 'cancelled';

// export type Order = {
//   id: string;
//   orderNumber: string;
//   items: CartItem[];
//   total: number;
//   subtotal: number;
//   deliveryCharge: number;
//   gst: number;
//   discount: number;
//   status: OrderStatus;
//   eventDate: string;
//   eventTime: string;
//   eventType: string;
//   venue: string;
//   guestCount: number;
//   specialInstructions?: string;
//   address: Address;
//   paymentMethod: string;
//   createdAt: string;
//   timeline: { status: OrderStatus; label: string; date: string; done: boolean }[];
// };

// export type AppNotification = {
//   id: string;
//   type: 'booking' | 'payment' | 'order' | 'team' | 'reminder' | 'offer' | 'arrival';
//   title: string;
//   message: string;
//   date: string;
//   read: boolean;
//   icon: string;
// };

// export type User = {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   avatar: string;
//   isPremium: boolean;
//   addressLine1?: string;
//   addressLine2?: string;
//   city?: string;
//   state?: string;
//   pincode?: string;
//   country?: string;
// };

// export type Coupon = {
//   code: string;
//   discount: number;
//   type: 'percentage' | 'flat';
//   minOrder: number;
//   description: string;
// };

// export type HeroBanner = {
//   id: string;
//   title: string;
//   subtitle: string;
//   image: string;
//   cta: string;
//   ctaLink: string;
//   displayOrder: number;
//   isActive: boolean;
// };



// types/index.ts

export type Category = {
  id: string;
  name: string;
  category_name: string;
  slug: string;
  icon: string;
  image: string;
  color: string;
  productCount: number;
};

export type Review = {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
};

export type Product = {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  features: string[];
  specifications: Record<string, any> | { label: string; value: string }[];
  colors: string[];
  sizes: string[];
  color_images?: Record<string, string[]>;
  inStock: boolean;
  stockCount: number;
  soldCount: number;
  isTrending: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  brand: string;
  weight: string;
  dimensions: string;
  material: string;
  careInstructions: string;
  warranty: string;
  returnPolicy: string;
  shippingInfo: string;
  reviews: Review[];
  relatedIds: string[];
};

export type Package = {
  id: string;
  name: string;
  tier: 'Basic' | 'Premium' | 'Luxury' | 'Silver' | 'Gold' | 'Platinum';
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  image: string;
  images?: string[];
  guestCapacity: number;
  description: string;
  includes: string[];
  catering: boolean | string[];
  stageDecoration: boolean | string[];
  flowerDecoration: boolean | string[];
  lighting: boolean | string[];
  photography: boolean | string[];
  videography: boolean | string[];
  soundSystem: boolean | string[];
  djSetup?: boolean;
  isActive: boolean;
};

export type AddOn = {
  id: string;
  name: string;
  price: number;
  icon: string;
  description?: string;
  category?: string;
  is_default?: boolean;
  is_active?: boolean;
};

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  type: 'product' | 'package';
  packageId?: string;
  selectedColor?: string;
  selectedSize?: string;
  addons?: {
    id: string;
    name: string;
    price: number;
    icon: string;
  }[];
};

export type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

export type OrderStatus = 'pending' | 'confirmed' | 'team_assigned' | 'in_progress' | 'completed' | 'cancelled';

export type Order = {
  id: string;
  orderNumber: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  deliveryCharge: number;
  gst: number;
  discount: number;
  status: OrderStatus;
  eventDate: string;
  eventTime: string;
  eventType: string;
  venue: string;
  guestCount: number;
  specialInstructions?: string;
  address: Address;
  paymentMethod: string;
  createdAt: string;
  timeline: { status: OrderStatus; label: string; date: string; done: boolean }[];
};

export type AppNotification = {
  id: string;
  type: 'booking' | 'payment' | 'order' | 'team' | 'reminder' | 'offer' | 'arrival';
  title: string;
  message: string;
  date: string;
  read: boolean;
  icon: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  isPremium: boolean;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  createdAt?: string;
  updatedAt?: string;
  full_name?: string;
  username?: string;
  customer_id?: string;
  profile_image?: string;
  profile_picture?: string;
  mobile?: string;
  phoneNumber?: string;
  address_line1?: string;
  address_line2?: string;
  address1?: string;
  address2?: string;
  city_name?: string;
  state_name?: string;
  zip_code?: string;
  postal_code?: string;
  registration_date?: string;
  is_premium?: boolean;
};

export type Coupon = {
  code: string;
  discount: number;
  type: 'percentage' | 'flat';
  minOrder: number;
  description: string;
};

export type HeroBanner = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  ctaLink: string;
  displayOrder: number;
  isActive: boolean;
};

export type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  accessToken?: string;
  user?: User;
  customer?: User;
  requiresOTP?: boolean;
  email?: string;
};

export type CartApiResponse = {
  success: boolean;
  message?: string;
  data?: CartItem[];
  count?: number;
};

export type AuthResponse = {
  success: boolean;
  message?: string;
  token?: string;
  accessToken?: string;
  user?: User;
  customer?: User;
  data?: {
    token?: string;
    accessToken?: string;
    user?: User;
    customer?: User;
  };
  requiresOTP?: boolean;
  email?: string;
};