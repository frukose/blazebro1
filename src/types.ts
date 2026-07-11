export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  sizes: string[];
  description: string;
  specs: string[];
  image: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  timestamp: string;
  items: {
    productId: string;
    code: string;
    name: string;
    size: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  customerName: string;
  status: 'PENDING_WHATSAPP' | 'CONFIRMED' | 'DELIVERED' | 'ARCHIVED';
}

export interface SystemSettings {
  whatsappNumber: string;
  latitude: string;
  longitude: string;
  tagline: string;
  adminPasscode: string;
  allowAiAdvisor: boolean;
  storeDiscount: number;
}

export interface AdminStats {
  views: number;
  whatsappClicks: number;
  potentialRevenue: number;
}
