import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Answer } from '../../core/models/answer.model';
import { Survey } from '../../core/models/survey.model';
import { QuestionWithAnswers, SurveyService } from '../../core/services/survey.service';
import { isEnded } from '../../core/utils/survey-state';
import { hasVoted, markVoted } from '../../core/utils/voted-surveys';
import { Button } from '../../shared/components/button/button';
import { AnswerSelection, AnswerToggle, QuestionList } from './components/question-list/question-list';
import { ResultPanel } from './components/result-panel/result-panel';
import { SurveyHeader } from './components/survey-header/survey-header';

/** Single choice replaces the selection, multiple choice adds or removes the answer. */
function toggleAnswerId(selected: string[], answerId: string, multiple: boolean): string[] {
  if (!multiple) return [answerId];
  return selected.includes(answerId) ? selected.filter((id) => id !== answerId) : [...selected, answerId];
}

@Component({
  selector: 'app-survey-detail',
  templateUrl: './survey-detail.component.html',
  styleUrl: './survey-detail.component.scss',
  imports: [RouterLink, Button, SurveyHeader, QuestionList, ResultPanel],
})
export class SurveyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private surveyService = inject(SurveyService);
  private destroyRef = inject(DestroyRef);

  survey = signal<Survey | null>(null);
  questions = signal<QuestionWithAnswers[]>([]);
  isLoading = signal(true);

  selection = signal<AnswerSelection>({});
  hasVoted = signal(false);
  isSubmitting = signal(false);
  voteError = signal<string | null>(null);

  isEnded = computed(() => {
    const survey = this.survey();
    return survey ? isEnded(survey) : false;
  });

  /** Ended surveys and surveys the user already voted on can be viewed, but not answered. */
  isLocked = computed(() => this.isEnded() || this.hasVoted());

  isComplete = computed(() => {
    const questions = this.questions();
    return questions.length > 0 && questions.every((question) => (this.selection()[question.id] ?? []).length > 0);
  });

  /** Loads the survey from the URL and starts listening for live votes. */
  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) await this.loadSurvey(id);
    this.isLoading.set(false);
  }

  /** Selects or deselects an answer – ignored for ended or already answered surveys. */
  toggleAnswer({ question, answerId }: AnswerToggle): void {
    if (this.isLocked()) return;
    this.selection.update((selection) => ({
      ...selection,
      [question.id]: toggleAnswerId(selection[question.id] ?? [], answerId, question.allow_multiple),
    }));
  }

  /** Sends the vote once every question is answered and shows an error if saving fails. */
  async completeSurvey(): Promise<void> {
    const survey = this.survey();
    if (!survey || !this.isComplete() || this.isLocked() || this.isSubmitting()) return;
    this.isSubmitting.set(true);
    this.voteError.set(null);
    try {
      await this.submitVote(survey.id);
    } catch (error) {
      console.error(error);
      this.voteError.set('Your vote could not be saved. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  /** Loads survey and questions in parallel and remembers whether this browser already voted. */
  private async loadSurvey(id: string): Promise<void> {
    const [survey, questions] = await Promise.all([
      this.surveyService.getSurveyById(id),
      this.surveyService.getQuestionsForSurvey(id),
    ]);
    this.survey.set(survey);
    this.questions.set(questions);
    this.hasVoted.set(hasVoted(id));
    this.watchVotes(id, questions);
  }

  /** Saves the vote, locks the survey for this browser and reloads the current results. */
  private async submitVote(surveyId: string): Promise<void> {
    await this.surveyService.vote(Object.values(this.selection()).flat());
    markVoted(surveyId);
    this.hasVoted.set(true);
    this.questions.set(await this.surveyService.getQuestionsForSurvey(surveyId));
  }

  /** Live results: every new vote (also from other users) updates the bars immediately. */
  private watchVotes(surveyId: string, questions: QuestionWithAnswers[]): void {
    if (!questions.length) return;
    const questionIds = questions.map((question) => question.id);
    const stopWatching = this.surveyService.watchVotes(surveyId, questionIds, (answer) => this.applyVotes(answer));
    this.destroyRef.onDestroy(stopWatching);
  }

  /** Takes over the new vote count of a changed answer. */
  private applyVotes(changed: Answer): void {
    this.questions.update((questions) =>
      questions.map((question) => ({
        ...question,
        answers: question.answers.map((answer) => (answer.id === changed.id ? { ...answer, votes: changed.votes } : answer)),
      })),
    );
  }
}
