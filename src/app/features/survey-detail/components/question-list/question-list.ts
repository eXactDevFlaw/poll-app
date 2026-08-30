import { Component, input } from '@angular/core';
import { QuestionWithAnswers } from '../../../../core/services/survey.service';
import { AnswerOption } from '../../../../shared/components/answer-option/answer-option';

@Component({
  selector: 'app-question-list',
  imports: [AnswerOption],
  templateUrl: './question-list.html',
  styleUrl: './question-list.scss',
})
export class QuestionList {
  questions = input.required<QuestionWithAnswers[]>();

  letterFor(answerIndex: number): string {
    return String.fromCharCode(65 + answerIndex);
  }
}
