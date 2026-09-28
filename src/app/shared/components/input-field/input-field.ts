import { booleanAttribute, Component, input, model } from '@angular/core';
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

  clear(): void {
    this.value.set('');
  }
}
