import { booleanAttribute, Component, computed, input, model } from '@angular/core';

import { DeleteButton } from '../delete-button/delete-button';

let nextId = 0;

@Component({
  selector: 'app-input-field',
  imports: [DeleteButton],
  templateUrl: './input-field.html',
  styleUrl: './input-field.scss',
})
export class InputField {
  label = input<string>('');
  /** Accessible name for fields without a visible label. */
  ariaLabel = input<string>('');
  placeholder = input<string>('');
  type = input<'text' | 'date'>('text');
  min = input<string>('');
  /** Maximum number of characters that can be typed or pasted. */
  maxLength = input<number | null>(null);
  multiline = input(false, { transform: booleanAttribute });
  clearable = input(false, { transform: booleanAttribute });
  optional = input(false, { transform: booleanAttribute });
  required = input(false, { transform: booleanAttribute });
  error = input<string | undefined>(undefined);
  /** Marks the field as invalid without an own message (e.g. when a group shares one message). */
  invalid = input(false, { transform: booleanAttribute });

  value = model<string>('');

  readonly id = `input-field-${nextId++}`;
  readonly errorId = `${this.id}-error`;
  readonly counterId = `${this.id}-counter`;

  isAtLimit = computed(() => this.maxLength() !== null && this.value().length >= this.maxLength()!);

  /** Error and character counter, so screen readers read them together with the field. */
  describedBy = computed(() => {
    const ids = [this.error() ? this.errorId : '', this.maxLength() ? this.counterId : ''].filter(Boolean);
    return ids.join(' ') || null;
  });

  /** Takes over the typed text of the input or textarea. */
  onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement | HTMLTextAreaElement).value);
  }

  /** Empties the field (trash button next to it). */
  clear(): void {
    this.value.set('');
  }
}
