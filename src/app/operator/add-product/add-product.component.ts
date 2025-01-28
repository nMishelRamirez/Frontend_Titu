import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../conectionBF/api.service';
import { Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-add-product',
  standalone: true, // Declaramos que es un componente standalone
  imports: [CommonModule, FormsModule, ReactiveFormsModule], // Importamos módulos necesarios
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  // Propiedades del formulario
  nombre: string = '';
  precio: string = '';
  stock: string = '';
  categoria: string = '';
  descripcion: string = '';
  imagen: File | null = null; // Archivo de imagen 
  categories: any[] = []; // Aquí almacenaremos las categorías
  showSuccessMessage: boolean = false;// Propiedad para mostrar mensaje de éxito

  // Propiedades para el mensaje de validación
  validationMessage: string = '';
  isValid: boolean = false;

  // Vista previa del producto
  imagePreview: string | null = null; // Variable para la vista previa de la imagen

  constructor(private apiService: ApiService, private router: Router) {}


  ngOnInit(): void {
    // Llamar al servicio para obtener las categorías
    this.apiService.getCategories().subscribe(
      (data) => {
        this.categories = data; // Asignar los datos al array de categorías
      },
      (error) => {
        console.error('Error al cargar las categorías:', error);
      }
    );
  }

  // Método para enviar el formulario
  onSubmit(): void {
    console.log('Formulario enviado'); // Verifica que esto se imprime en la consola
    this.validarCampos();
  
    if (!this.isValid) {
      console.error('Por favor, completa todos los campos antes de enviar.');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', this.nombre);
    formData.append('price', this.precio.replace('$', ''));
    formData.append('stock', this.stock);
    formData.append('category', this.categoria);
    formData.append('description', this.descripcion);
  
    if (this.imagen) {
      formData.append('image', this.imagen);
      console.log('Imagen seleccionada:', this.imagen.name);
    }
  
    console.log('Enviando datos:', formData); // Muestra el objeto FormData en la consola
  
    this.apiService.addProduct(formData).subscribe(
      (response) => {
        console.log('Producto añadido con éxito:', response);
        // Mostrar mensaje de éxito
        this.showSuccessMessage = true;

        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
        this.resetForm();
      },
      (error) => {
        console.error('Error al añadir el producto:', error);
        this.validationMessage = error.error.message || 'Hubo un error al añadir el producto.';
      this.isValid = false;
      setTimeout(() => {
        this.validationMessage = '';
      }, 3000);
      }
    );
  }
  

  // Método para reiniciar el formulario
  resetForm(): void {
    this.nombre = '';
    this.precio = '';
    this.stock = '';
    this.categoria = '';
    this.descripcion = '';
    this.imagen = null;
    this.imagePreview = null;
    this.validationMessage = '';
    this.isValid = false;
  }

  // Método de validación
  validarCampos(): void {
    if (!this.nombre || !this.precio || this.stock === null || !this.categoria || !this.descripcion || !this.imagen) {
      this.validationMessage = 'Por favor, rellene todos los campos.';
      this.isValid = false;
    } else {
      this.validationMessage = '';
      this.isValid = true;
    }
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

  // Método para formatear el precio
  formatPrice(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;

    // Asegura que el texto siempre empiece con el signo de dólar
    if (!value.startsWith('$')) {
      value = `$${value.replace(/[^0-9.]/g, '')}`; // Remueve caracteres no numéricos excepto '.'
    } else {
      value = `$${value.substring(1).replace(/[^0-9.]/g, '')}`; // Remueve caracteres inválidos después del '$'
    }

    // Permitir solo un punto decimal
    const parts = value.split('.');
    if (parts.length > 2) {
      value = `$${parts[0].substring(1)}.${parts.slice(1).join('').replace(/[^0-9]/g, '')}`; // Mantiene el primer punto decimal válido
    }

    // Actualiza el modelo y el valor del campo
    this.precio = value;
    inputElement.value = value;
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

  //cancelar y volver
  // Método para "Cancelar y volver"
  onCancelAndGoBack(): void {
    this.router.navigate(['/operator/table-products']); // Redirige a la ruta especificada
  }
}
