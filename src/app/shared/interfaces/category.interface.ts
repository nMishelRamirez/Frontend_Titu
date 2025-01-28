export interface Category {
  _id: string; // Opcional para nuevas categorías antes de guardarse
  name: string;
  description: string;
  image: string; // Ruta o URL de la imagen
}