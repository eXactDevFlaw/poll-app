import { booleanAttribute, Component, input, output } from '@angular/core';

import { QuestionWithAnswers } from '../../../../core/services/survey.service';
import { answerLetter } from '../../../../core/utils/answer-letter';
import { AnswerOption } from '../../../../shared/components/answer-option/answer-option';

export type AnswerSelection = Record<string, string[]>;

export interface AnswerToggle {
  question: QuestionWithAnswers;
  answerId: string;
}

@Component({
  selector: 'app-question-list',
  imports: [AnswerOption],
  templateUrl: './question-list.html',
  styleUrl: './question-list.scss',
})
export class QuestionList {
  questions = input.required<QuestionWithAnswers[]>();
  /** Selected answer ids per question id. */
  selection = input<AnswerSelection>({});
  disabled = input(false, { transform: booleanAttribute });

  answerToggled = output<AnswerToggle>();

  readonly letterFor = answerLetter;

  /** Whether the answer is currently selected for this question. */
  isSelected(questionId: string, answerId: string): boolean {
    return (this.selection()[questionId] ?? []).includes(answerId);
  }
}
