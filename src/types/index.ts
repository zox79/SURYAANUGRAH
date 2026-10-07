export type MainCategory = 
  | 'Lantai Keramik' 
  | 'Granit' 
  | 'Batu Alam' 
  | 'Sanitary' 
  | 'Others/Lainnya';

export type PageView = 'preview' | 'bagan' | 'tanya-ai' | 'admin' | 'my-orders';

export type UserRole = 'guest' | 'member' | 'admin';

export interface UserAccount {
  id: string;
  phone: string;
  name: string;
  role: 'member' | 'admin';
  createdAt: string;
}

export interface CategoryInfo {
  id: MainCategory;
  name: string;
  shortDesc: string;
  iconName: string;
  subcategories: string[];
}

export interface ProductItem {
  id: string;
  name: string;
  category: MainCategory;
  subcategory: string;
  sizes?: string[]; // e.g. ["40x40", "50x50", "60x60"]
  defaultSize?: string;
  surfaceFinish?: ('Glossy' | 'Matte')[];
  cuttingType?: ('Cutting' | 'Non Cutting')[];
  grades?: ('KW A' | 'KW B' | 'KW C')[];
  estimatedPriceRange?: string; // Rp estimasi per dus / pcs / m2
  numericPrice?: number; // base price for order calculation
  unit: string; // "dus", "pcs", "m²", "sak", "kaleng", "batang"
  image: string;
  description: string;
  features: string[];
  inStock: boolean;
  isPopular?: boolean;
}

export interface StoreBranch {
  id: string;
  name: string;
  type: string;
  address: string;
  district: string;
  city: string;
  phone: string;
  waNumber: string;
  mapsUrl: string;
  badge: string;
  hours: string;
}

export interface InquiryItem {
  product: ProductItem;
  quantity: number;
  selectedSize?: string;
  selectedFinish?: string;
  selectedCutting?: string;
  selectedGrade?: string;
  customNotes?: string;
}

export type OrderShippingMethod = 'delivery' | 'pickup';
export type OrderPaymentMethod = 'transfer' | 'qris' | 'cod';
export type OrderPaymentStatus = 'unpaid' | 'paid';
export type OrderStatus = 'pending' | 'verified_paid' | 'shipping' | 'completed' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  category: MainCategory;
  subcategory: string;
  unit: string;
  size?: string;
  grade?: string;
  surfaceFinish?: string;
  cuttingType?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderRecord {
  id: string; // e.g. "SAK-ORD-20261007-8821"
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  memberId?: string;
  shippingMethod: OrderShippingMethod;
  deliveryAddress?: string;
  deliveryDistrict?: string;
  pickupStoreBranch?: string;
  paymentMethod: OrderPaymentMethod;
  paymentStatus: OrderPaymentStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  receiptNumber?: string; // Official receipt code
  receiptIssuedAt?: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  notes?: string;
  createdAt: string;
}

export interface GoogleScriptConfig {
  webhookUrl: string; // fallback / unified webhook
  isEnabled: boolean;
  lastSyncTime?: string;
  autoSyncOrders: boolean;

  // Database 1: Informasi Pelanggan & Pesanan
  ordersWebhookUrl?: string;
  ordersSyncEnabled?: boolean;
  ordersLastSyncTime?: string;

  // Database 2: Data Produk & Input Produk Baru
  productsWebhookUrl?: string;
  productsSyncEnabled?: boolean;
  productsLastSyncTime?: string;
  autoSyncProducts?: boolean;
}
