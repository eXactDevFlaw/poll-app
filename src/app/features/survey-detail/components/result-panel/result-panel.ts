import { Component, computed, input } from '@angular/core';

import { Answer } from '../../../../core/models/answer.model';
import { QuestionWithAnswers } from '../../../../core/services/survey.service';
import { answerLetter } from '../../../../core/utils/answer-letter';
import { EmptyResults } from '../empty-results/empty-results';

const PERCENT = 100;

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

/** Share of one answer in all votes of its question, rounded to whole percent. */
function toAnswerResult(answer: Answer, index: number, totalVotes: number): AnswerResult {
  const percent = totalVotes ? Math.round((answer.votes / totalVotes) * PERCENT) : 0;
  return { id: answer.id, letter: answerLetter(index), text: answer.text, votes: answer.votes, percent };
}

/** Result of one question with the percentage of every answer. */
function toQuestionResult(question: QuestionWithAnswers): QuestionResult {
  const totalVotes = question.answers.reduce((sum, answer) => sum + answer.votes, 0);
  return {
    id: question.id,
    text: question.text,
    answers: question.answers.map((answer, index) => toAnswerResult(answer, index, totalVotes)),
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
