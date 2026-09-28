import { Component, input, model, output } from '@angular/core';

import { DraftQuestion } from '../../../../core/services/survey.service';
import { answerLetter } from '../../../../core/utils/answer-letter';
import { Button } from '../../../../shared/components/button/button';
import { DeleteButton } from '../../../../shared/components/delete-button/delete-button';
import { InputField } from '../../../../shared/components/input-field/input-field';
import { createEmptyQuestion, MAX_ANSWERS, MIN_ANSWERS, QuestionErrors } from '../../survey-form.validation';

@Component({
  selector: 'app-question-block',
  imports: [InputField, Button, DeleteButton],
  templateUrl: './question-block.html',
  styleUrl: './question-block.scss',
})
export class QuestionBlock {
  index = input.required<number>();
  question = model.required<DraftQuestion>();
  errors = input<QuestionErrors>({});

  remove = output<void>();

  readonly maxAnswers = MAX_ANSWERS;
  readonly minAnswers = MIN_ANSWERS;
  readonly letterFor = answerLetter;

  /** Updates the question text. */
  setText(text: string): void {
    this.question.update((question) => ({ ...question, text }));
  }

  /** Reads the "Allow multiple answers" checkbox and stores its state. */
  onAllowMultipleChange(event: Event): void {
    const allow_multiple = (event.target as HTMLInputElement).checked;
    this.question.update((question) => ({ ...question, allow_multiple }));
  }

  /** Updates the text of one answer field. */
  setAnswer(answerIndex: number, text: string): void {
    this.question.update((question) => ({
      ...question,
      answers: question.answers.map((answer, i) => (i === answerIndex ? text : answer)),
    }));
  }

  /** Adds an empty answer field. */
  addAnswer(): void {
    this.question.update((question) => ({ ...question, answers: [...question.answers, ''] }));
  }

  /** Removes one answer field. */
  removeAnswer(answerIndex: number): void {
    this.question.update((question) => ({
      ...question,
      answers: question.answers.filter((_, i) => i !== answerIndex),
    }));
  }

  /** The first question is only cleared (a survey needs at least one), every other one is removed. */
  onDelete(): void {
    const isFirstQuestion = this.index() === 0;
    if (isFirstQuestion) {
      this.question.set(createEmptyQuestion());
    } else {
      this.remove.emit();
    }
  }
}
