import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../conectionBF/product.service';
import { ApiService } from '../../conectionBF/api.service';

@Component({
  selector: 'app-update-product',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent {
  nombre: string = '';
  precio: string = '';
  stock: string = '';
  categoria: string = '';
  descripcion: string = '';
  imagen: File | null = null;
  productId: string = '';
  categories: any[] = [];
  showSuccessMessage: boolean = false;
  // Vista previa del producto
  imagePreview: string | null = null; // Variable para la vista previa de la imagen
  constructor(private productService: ProductService, private apiService: ApiService, private router: Router) {}
  

  ngOnInit(): void {
    // Cargar las categorías primero
    this.apiService.getCategories().subscribe(
      (data) => {
        this.categories = data; // Asignar los datos al array de categorías
    
        // Ahora que las categorías están cargadas, subscribirnos al producto
        this.productService.product$.subscribe(product => {
          console.log('Producto recibido:', product);
          
          if (product) {
            this.nombre = product.name;
            this.precio = product.price;
            this.stock = product.stock;
            this.descripcion = product.description;
  
            // Asignar el ID de la categoría a this.categoria
            if (product.category) {
              const selectedCategory = this.categories.find(category => category.name === product.category);
    
              // Si encontramos la categoría en la lista de categorías, asignamos su ID
              if (selectedCategory) {
                this.categoria = selectedCategory._id;
                console.log('ID de la categoría asignado:', this.categoria);
              } else {
                console.log('Categoría no encontrada en la lista de categorías');
              }
            }
    
            // Carga de la imagen
            if (product.image) {
              this.imagePreview = product.image;
            }
  
            // Obtener el ID del producto por nombre y categoría
            const productName = product.name;
            console.log('Nombre del producto:', productName);
            const categoryName = product.category;
            console.log('Categoría del producto:', categoryName);
            
            // Llamada al servicio para obtener el ID del producto
            this.apiService.getIdByNameCategory().subscribe({
              next: (products) => {
                // Buscar el producto específico
                const product = products.find(
                  (p) => p.name === productName && p.category === categoryName
                );
                if (product) {
                  this.productId = product.id; // Asignar el ID
                  console.log('ID del producto:', this.productId);
                } else {
                  alert('Producto no encontrado.');
                }
              },
              error: (err) => {
                console.error('Error al obtener el ID del producto:', err);
              }
            });
          }
        });
      },
      (error) => {
        console.error('Error al cargar las categorías:', error);
      }
    );
  }
  
  


  

  // Método para formatear el stock
  formatStock(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;

    // Remueve cualquier carácter que no sea un número
    value = value.replace(/[^0-9]/g, '');

    // Actualiza el modelo y el valor del campo
    this.stock = value;
    inputElement.value = value;
  }


  // Método para la vista previa de la imagen
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Verifica que sea una imagen
      if (file.type.startsWith('image/')) {
        this.imagen = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string; // Genera la URL para la vista previa
        };
        reader.readAsDataURL(file); // Lee el archivo como Data URL
      } else {
        alert('Por favor, selecciona un archivo de imagen válido (SVG, PNG, JPG o GIF).');
      }
    }
  }

   // Método para actualizar el producto
   updateProduct(): void {
    // Crear FormData para enviar los datos
    const formData = new FormData();
    formData.append('name', this.nombre);
    formData.append('price', this.precio);
    formData.append('stock', this.stock);
    formData.append('category', this.categoria); // Enviar la categoría seleccionada
    formData.append('description', this.descripcion);

    // Si hay una nueva imagen seleccionada, la agregamos a FormData
    if (this.imagen) {
      formData.append('image', this.imagen, this.imagen.name);
    }

    // Llamar al servicio para actualizar el producto
    const productId = this.productId;

    this.apiService.updateProduct(productId, formData).subscribe(
      (response) => {
        console.log('Producto actualizado:', response);
        this.showSuccessMessage = true; // Mostrar mensaje de éxito
        // Ocultar el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 3000); // 3000 ms = 3 segundos
      },
      (error) => {
        console.error('Error al actualizar el producto:', error);
        this.showSuccessMessage = false;
      }
    );
  }

  onCancelAndGoBack(): void {
    this.router.navigate(['/operator/table-products']); // Redirige a la ruta especificada
  }




}
