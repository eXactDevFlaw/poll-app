import { Component, computed, input } from '@angular/core';
import { QuestionWithAnswers } from '../../../../core/services/survey.service';
import { EmptyResults } from '../empty-results/empty-results';

interface AnswerResult {
  id: string;
  letter: string;
  text: string;
  votes: number;
  percent: number;
}

interface QuestionResult {
  id: string;
  text: string;
  answers: AnswerResult[];
}

/** Share of each answer in all votes of its question, rounded to whole percent. */
function toQuestionResult(question: QuestionWithAnswers): QuestionResult {
  const total = question.answers.reduce((sum, answer) => sum + answer.votes, 0);
  return {
    id: question.id,
    text: question.text,
    answers: question.answers.map((answer, index) => ({
      id: answer.id,
      letter: String.fromCharCode(65 + index),
      text: answer.text,
      votes: answer.votes,
      percent: total ? Math.round((answer.votes / total) * 100) : 0,
    })),
  };
}

@Component({
  selector: 'app-result-panel',
  imports: [EmptyResults],
  templateUrl: './result-panel.html',
  styleUrl: './result-panel.scss',
})
export class ResultPanel {
  questions = input.required<QuestionWithAnswers[]>();

  results = computed(() => this.questions().map(toQuestionResult));
  hasVotes = computed(() => this.questions().some((question) => question.answers.some((answer) => answer.votes > 0)));
}
