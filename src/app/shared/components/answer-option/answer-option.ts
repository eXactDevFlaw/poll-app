import { Component, input } from '@angular/core';

@Component({
  selector: 'app-answer-option',
  imports: [],
  templateUrl: './answer-option.html',
  styleUrl: './answer-option.scss',
})
export class AnswerOption {
  letter = input.required<string>();
  label = input.required<string>();
}
