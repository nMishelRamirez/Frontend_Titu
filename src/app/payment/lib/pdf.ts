// lib/pdf.ts
import { jsPDF } from 'jspdf';
// Función asincrónica para cargar el SVG como base64
// Función para convertir SVG a base64 usando canvas
const loadSvgAsBase64 = async (path: string): Promise<string> => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error('No se pudo cargar el SVG');
  }
  const text = await response.text();

  // Crear un nuevo objeto Image
  const img = new Image();
  img.src = 'data:image/svg+xml;base64,' + btoa(text);

  // Espera a que la imagen esté cargada
  return new Promise<string>((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject('No se pudo obtener contexto de canvas');
        return;
      }
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const base64 = canvas.toDataURL('image/png'); // Convierte a base64 PNG
      resolve(base64);
    };
    img.onerror = () => reject('Error cargando la imagen');
  });
};



// Función para dibujar el encabezado en el documento PDF
async function dibujarEncabezado(doc: jsPDF): Promise<void> {

  // Agregar logotipo
  //const imgData = ''; // Aquí debes poner la base64 de tu logotipo
  // Agregar logotipo como SVG
  const imgData = await loadSvgAsBase64('/img/logo11.svg');
  doc.addImage(imgData, 'PNG', 8, 18, 30, 30);


  // Información de la empresa
  doc.setFont('helvetica', 'bold'); // Fuente Helvetica en negrilla
  doc.setFontSize(24);
  doc.text('Tienda Online Titu', 40, 33);
  doc.setFontSize(12);
  doc.text('Tel: 0987384809 ', 40, 45);


  // Geometría de color (factura)
  doc.setFillColor(0, 51, 102); // Azul oscuro
  doc.rect(0, 0, 210, 15, 'F'); // Rectángulo azul oscuro en la parte superior

  doc.setFillColor(173, 216, 230); // Azul claro
  doc.rect(150, 0, 90, 30, 'F');

  // Primer triángulo (azul oscuro)
  doc.setFillColor(0, 104, 192); // Azul oscuro
  doc.triangle(120, 30, 106, 15, 150, 15, 'F'); // Triángulo azul oscuro apuntando hacia abajo

  // Segundo triángulo (azul claro)
  doc.setFillColor(173, 216, 230); // Azul claro
  doc.triangle(150, 30, 150, 0, 120, 30, 'F'); // Triángulo azul claro apuntando hacia abajo

  doc.setFillColor(255, 255, 255); // Blanco
  doc.setTextColor(0, 51, 102); // Texto azul oscuro
  doc.setFontSize(25);
  doc.text('FACTURA', 155, 20);
}

// Función para dibujar el pie de página en el documento PDF
function dibujarPieDePagina(doc: jsPDF): void {
  const pageHeight = doc.internal.pageSize.height;

  // Geometría de color (pie de página)
  doc.setFillColor(0, 51, 102); // Azul oscuro
  doc.rect(0, pageHeight - 15, 210, 15, 'F'); // Rectángulo azul oscuro en la parte inferior

  doc.setFillColor(173, 216, 230); // Azul claro
  doc.rect(150, pageHeight - 30, 90, 30, 'F');

  // Primer triángulo (azul oscuro)
  doc.setFillColor(0, 104, 192); // Azul oscuro
  doc.triangle(120, pageHeight - 30, 106, pageHeight - 15, 150, pageHeight - 15, 'F'); // Triángulo azul oscuro apuntando hacia arriba

  // Segundo triángulo (azul claro)
  doc.setFillColor(173, 216, 230); // Azul claro
  doc.triangle(150, pageHeight - 30, 150, pageHeight, 120, pageHeight - 30, 'F'); // Triángulo azul claro apuntando hacia arriba
}

export async function generarFactura(factura: any): Promise<void> {
  const doc = new jsPDF();
  // Dibujar el encabezado inicial
  await dibujarEncabezado(doc);
  // Dibujar el pie de página inicial
  dibujarPieDePagina(doc);
  // Detalles de la factura con estilos y posiciones ajustadas
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Factura:', 155, 35);
  doc.setFont('helvetica', 'bold');
  doc.text(factura.numero, 170, 35);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Fecha:', 155, 40);
  doc.setFont('helvetica', 'bold');
  doc.text(factura.fecha, 170, 40);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMACION DEL CLIENTE', 16, 60);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Cliente:', 16, 70);
  doc.setFont('helvetica', 'normal');
  doc.text(factura.cliente, 48, 70);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Email:', 16, 75);
  doc.setFont('helvetica', 'normal');
  doc.text(factura.email, 48, 75);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Teléfono:', 16, 80);
  doc.setFont('helvetica', 'normal')
  doc.text(factura.telefono, 48, 80);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Dirección:', 16, 85);
  doc.setFont('helvetica', 'normal');
  doc.text(factura.direccion, 48, 85);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Código Postal:', 16, 90);
  doc.setFont('helvetica', 'normal');
  doc.text(factura.codigoPostal, 48, 90);

  

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Forma de Pago:', 130, 70);
  doc.setFont('helvetica', 'normal');
  doc.text('PayPal', 170, 70);

  // Encabezados de tabla de productos con color de fondo
  doc.setFillColor(200, 200, 255);  // Color de fondo azul claro
  doc.rect(14, 95, 186, 10, 'F');  // Dibuja un rectángulo con color de fondo
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Producto', 16, 100);
  doc.text('Cantidad', 90, 100);
  doc.text('Precio', 140, 100);
  doc.text('Total', 180, 100);

  // Línea separadora
  doc.setLineWidth(0.5); // Establecer el grosor de la línea
  doc.line(14, 105, 200, 105);

  // Detalle de productos
  let y = 115;
  const maxY = doc.internal.pageSize.height - 45; // Límite de página
  factura.productos.forEach((producto: any, index: number) => {
    if (y > 280) { // Si se alcanza el límite de la página
      doc.addPage();
      dibujarEncabezado(doc); // Dibujar el encabezado en la nueva página
      dibujarPieDePagina(doc);
      y = 60; // Reinicia el valor de y para la nueva página
      doc.setFillColor(200, 200, 255); // Color de fondo para filas alternas
      doc.rect(14, 15, 186, 10, 'F'); // Dibuja un rectángulo con color de fondo
      doc.setFontSize(12);
      doc.text('Producto', 16, 20);
      doc.text('Cantidad', 90, 20);
      doc.text('Precio', 140, 20);
      doc.text('Total', 180, 20);
      doc.line(14, 25, 200, 25);
      y = 60;
    }

    // Alterna colores de fila para mejor legibilidad
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 255);  // Color de fondo para filas alternas
      doc.rect(14, y - 5, 186, 10, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.text(producto.descripcion, 16, y);
    doc.text(producto.cantidad.toString(), 90, y);
    doc.text(`$${producto.precio.toFixed(2)}`, 140, y);
    doc.text(`$${(producto.cantidad * producto.precio).toFixed(2)}`, 180, y);
    y += 10;
  });

  // Dibujar la línea separadora al final de la lista de productos
  doc.setLineWidth(0.5); // Establecer el grosor de la línea
  doc.line(14, y, 200, y);

  // Resumen de totales
  if (y > maxY) {
    doc.addPage();
    dibujarEncabezado(doc);
    dibujarPieDePagina(doc);
    y = 60;
  }

  const subtotal = factura.productos.reduce((sum: number, producto: any) => sum + (producto.cantidad * producto.precio), 0);
  const total = subtotal;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal'); // Fuente Helvetica en negrilla
  doc.text(`Subtotal:  $${subtotal.toFixed(2)}`, 160, y + 10);

  doc.setLineWidth(0.5); // Establecer el grosor de la línea
  doc.line(150, y + 13, 200, y + 13);

  doc.setFont('helvetica', 'bold'); // Fuente Helvetica en negrilla
  doc.setFontSize(16);
  doc.text(`    Total: $${total.toFixed(2)}`, 160, y + 20);

  doc.setLineWidth(0.5); // Establecer el grosor de la línea
  doc.line(150, y + 23, 200, y + 23);

  // Agreadecimiento
  y += 30;
  const maxYC = doc.internal.pageSize.height - 55; // Límite de página
  if (y > 280) {
    doc.addPage();
    dibujarEncabezado(doc);
    dibujarPieDePagina(doc);
    y = 60;
  }
  doc.text('¡Gracias por su compra!', 14, maxYC - 25);
  doc.setLineWidth(0.5); // Establecer el grosor de la línea
  doc.line(14, maxYC - 15, 200, maxYC - 15);

  // Información de contacto
  y += 30;
  if (y > maxYC) {
    doc.addPage();
    dibujarEncabezado(doc);
    dibujarPieDePagina(doc);
    y = 60;
  }
  const terms = '0987384809\ntitucorporation3@gmail.com\nFacebook: https://www.facebook.com/OnlineTitu/\nInstagram: https://www.instagram.com/titu.online/\nWhatsapp: https://chat.whatsapp.com/H9bCXEsF0Jf3icFxl2RmCm\nSitio web: https://titumarket.netlify.app/ ';
  doc.text('Contacto', 14, maxYC);
  doc.setFontSize(10);
  doc.text(terms, 14, maxY, { maxWidth: 180 });

  doc.save('factura.pdf');

}
