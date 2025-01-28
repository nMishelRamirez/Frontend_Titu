import { Category } from "./category.interface";

export interface Product {
  _id: string; // Opcional si no se ha guardado en la base de datos
  name: string;
  category: Category | string; // Puede ser una relación con el objeto completo o el ID de la categoría
  description: string;
  price: number;
  stock: number;
  image?: string; // Opcional, ya que no siempre puede estar presente
}

export interface ProductItemCart {
  product: Product;
  quantity: number;
}
 