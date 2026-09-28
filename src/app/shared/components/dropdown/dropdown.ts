import { booleanAttribute, Component, ElementRef, HostListener, inject, input, model, signal } from '@angular/core';

let nextId = 0;

@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
})
export class Dropdown {
  private elementRef = inject(ElementRef);

  options = input<string[]>([]);
  placeholder = input<string>('Select');
  required = input(false, { transform: booleanAttribute });
  error = input<string | undefined>(undefined);

  selected = model<string>('');

  isOpen = signal(false);

  readonly errorId = `dropdown-${nextId++}-error`;

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
