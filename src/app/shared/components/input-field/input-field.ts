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
  placeholder = input<string>('');
  type = input<'text' | 'date'>('text');
  multiline = input(false, { transform: booleanAttribute });
  clearable = input(false, { transform: booleanAttribute });
  optional = input(false, { transform: booleanAttribute });

  value = model<string>('');

  readonly id = `input-field-${nextId++}`;

  clear(): void {
    this.value.set('');
  }
}
