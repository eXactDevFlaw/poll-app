import { booleanAttribute, Component, input, output } from '@angular/core';
import { QuestionWithAnswers } from '../../../../core/services/survey.service';
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

  letterFor(answerIndex: number): string {
    return String.fromCharCode(65 + answerIndex);
  }

  isSelected(questionId: string, answerId: string): boolean {
    return (this.selection()[questionId] ?? []).includes(answerId);
  }
}
