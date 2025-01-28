import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-price-range',
  imports: [],
  templateUrl: './price-range.component.html',
  styleUrl: './price-range.component.css'
})
export class PriceRangeComponent {
  @Output() addPriceRangeEvent = new EventEmitter<{minPrice: string; maxPrice: string}>();
  @Input() maxPriceInput = 100;

  sendPriceRange() {
    this.addPriceRangeEvent.emit({
      minPrice: this.inputMinEl.nativeElement.value,
      maxPrice: this.inputMaxEl.nativeElement.value,
    });
  }

  // Comportamiento de barra e inputs
  // --------------------------------
  @ViewChild('progress') progressEl!: ElementRef;
  @ViewChild('inputMin') inputMinEl!: ElementRef<HTMLInputElement>;
  @ViewChild('inputMax') inputMaxEl!: ElementRef<HTMLInputElement>;
  @ViewChild('rangeMin') rangeMinEl!: ElementRef<HTMLInputElement>;
  @ViewChild('rangeMax') rangeMaxEl!: ElementRef<HTMLInputElement>;

  priceGap = 1;

  onPriceChange(minValue: string, maxValue: string, event: Event): void {
    const minVal = parseInt(minValue, 10);
    const maxVal = parseInt(maxValue, 10);

    if ((maxVal - minVal >= this.priceGap) && maxVal <= 10000) {
      // Obtener la clase del elemento que llamó a la función
      const targetElement = event.target as HTMLElement;
      const callerClass = targetElement.className;

      if (callerClass === 'input-min') {
        this.rangeMinEl.nativeElement.value = (minVal).toString();
        this.progressEl.nativeElement.style.left = (minVal / parseInt(this.rangeMinEl.nativeElement.max)) * 100 + "%";
      } else {
        this.rangeMaxEl.nativeElement.value = (maxVal).toString();
        this.progressEl.nativeElement.style.right = 100 - (maxVal / parseInt(this.rangeMaxEl.nativeElement.max)) * 100 + "%";
      }
    } 
  }

  onRangeChange(minValue: string, maxValue: string, event: Event): void {
    const minVal = parseInt(minValue, 10);
    const maxVal = parseInt(maxValue, 10);

    if (maxVal - minVal < this.priceGap) {
      // Obtener la clase del elemento que llamó a la función
      const targetElement = event.target as HTMLElement;
      const callerClass = targetElement.className;

      if (callerClass === 'range-min') {
        this.rangeMinEl.nativeElement.value = (maxVal - this.priceGap).toString();
      } else {
        this.rangeMaxEl.nativeElement.value = (minVal + this.priceGap).toString();
      }
    } else {
      this.inputMinEl.nativeElement.value = minVal.toString();
      this.inputMaxEl.nativeElement.value = maxVal.toString();
      this.progressEl.nativeElement.style.left = (minVal / parseInt(this.rangeMinEl.nativeElement.max)) * 100 + "%";
      this.progressEl.nativeElement.style.right = 100 - (maxVal / parseInt(this.rangeMaxEl.nativeElement.max)) * 100 + "%";
    }
  }
}
