import { booleanAttribute, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-answer-option',
  imports: [],
  templateUrl: './answer-option.html',
  styleUrl: './answer-option.scss',
})
export class AnswerOption {
  letter = input.required<string>();
  label = input.required<string>();
  /** All options of one question share the same name (needed for radio buttons). */
  name = input.required<string>();
  multiple = input(false, { transform: booleanAttribute });
  checked = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });

  toggled = output<void>();
}
