export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id?: number;
  customer: {
    name: string;
    email: string;
    address: string;
  };
  items: CartItem[];
  total: number;
}
