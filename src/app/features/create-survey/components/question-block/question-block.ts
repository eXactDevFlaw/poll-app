import { Component, input, model, output } from '@angular/core';
import { DraftQuestion } from '../../../../core/services/survey.service';
import { InputField } from '../../../../shared/components/input-field/input-field';
import { Button } from '../../../../shared/components/button/button';

const MAX_ANSWERS = 6;
const MIN_ANSWERS = 2;

@Component({
  selector: 'app-question-block',
  imports: [InputField, Button],
  templateUrl: './question-block.html',
  styleUrl: './question-block.scss',
})
export class QuestionBlock {
  index = input.required<number>();
  question = model.required<DraftQuestion>();

  remove = output<void>();

  readonly maxAnswers = MAX_ANSWERS;
  readonly minAnswers = MIN_ANSWERS;

  letterFor(answerIndex: number): string {
    return String.fromCharCode(65 + answerIndex);
  }

  setText(text: string): void {
    this.question.update((question) => ({ ...question, text }));
  }

  setAllowMultiple(allow_multiple: boolean): void {
    this.question.update((question) => ({ ...question, allow_multiple }));
  }

  setAnswer(answerIndex: number, text: string): void {
    this.question.update((question) => ({
      ...question,
      answers: question.answers.map((answer, i) => (i === answerIndex ? text : answer)),
    }));
  }

  addAnswer(): void {
    this.question.update((question) => ({ ...question, answers: [...question.answers, ''] }));
  }

  removeAnswer(answerIndex: number): void {
    this.question.update((question) => ({
      ...question,
      answers: question.answers.filter((_, i) => i !== answerIndex),
    }));
  }

  onDelete(): void {
    if (this.index() === 0) {
      this.question.set({ text: '', allow_multiple: false, answers: ['', ''] });
    } else {
      this.remove.emit();
    }
  }
}
