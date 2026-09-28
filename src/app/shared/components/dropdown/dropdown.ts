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
  /** The trigger always shows the placeholder instead of the selected option. */
  keepPlaceholder = input(false, { transform: booleanAttribute });
  /** Opens the menu towards the left – for dropdowns at the right edge. */
  align = input<'left' | 'right'>('left');

  selected = model<string>('');

  isOpen = signal(false);

  readonly errorId = `dropdown-${nextId++}-error`;

  /** Opens or closes the menu. */
  toggle(): void {
    this.isOpen.update((open) => !open);
  }

  /** Selects an option and closes the menu. */
  select(option: string): void {
    this.selected.set(option);
    this.isOpen.set(false);
  }

  /** Closes the menu when the user clicks anywhere outside of it. */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const isClickInside = this.elementRef.nativeElement.contains(event.target);
    if (!isClickInside) this.isOpen.set(false);
  }
}
