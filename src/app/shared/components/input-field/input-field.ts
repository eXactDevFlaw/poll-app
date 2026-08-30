import { booleanAttribute, Component, input, model } from '@angular/core';

@Component({
  selector: 'app-input-field',
  imports: [],
  templateUrl: './input-field.html',
  styleUrl: './input-field.scss',
})
export class InputField {
  label = input<string>('');
  placeholder = input<string>('');
  type = input<'text' | 'date'>('text');
  multiline = input(false, { transform: booleanAttribute });
  clearable = input(false, { transform: booleanAttribute });

  value = model<string>('');

  clear(): void {
    this.value.set('');
  }
}
