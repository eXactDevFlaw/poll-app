import { Component, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'tertiary' | 'icon';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  variant = input<ButtonVariant>('primary');
  type = input<'button' | 'submit'>('button');
  disabled = input(false);

  buttonClick = output<void>();
}
