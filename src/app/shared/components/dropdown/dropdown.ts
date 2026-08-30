import { Component, ElementRef, HostListener, inject, input, model, signal } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
})
export class Dropdown {
  private elementRef = inject(ElementRef);

  label = input<string>('');
  options = input<string[]>([]);
  placeholder = input<string>('Select');

  selected = model<string>('');

  isOpen = signal(false);

  toggle(): void {
    this.isOpen.update((open) => !open);
  }

  select(option: string): void {
    this.selected.set(option);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
