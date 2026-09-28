import { Component, computed, inject, output, signal } from '@angular/core';

import { CATEGORIES } from '../../core/constants/categories';
import { Survey } from '../../core/models/survey.model';
import { DraftQuestion, NewSurveyMeta, SurveyService } from '../../core/services/survey.service';
import { Button } from '../../shared/components/button/button';
import { SurveyStatus } from '../../shared/components/survey-status/survey-status';
import { AddQuestionBtn } from './components/add-question-btn/add-question-btn';
import { QuestionBlock } from './components/question-block/question-block';
import { SurveyMetaForm } from './components/survey-meta-form/survey-meta-form';
import {
  cleanMeta,
  cleanQuestion,
  createEmptyQuestion,
  hasErrors,
  MetaErrors,
  QuestionErrors,
  validateMeta,
  validateQuestion,
} from './survey-form.validation';

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrl: './create-survey.component.scss',
  imports: [Button, SurveyStatus, SurveyMetaForm, QuestionBlock, AddQuestionBtn],
})
export class CreateSurveyComponent {
  private surveyService = inject(SurveyService);

  readonly categories = CATEGORIES;

  meta = signal<NewSurveyMeta>({ name: '', description: '', category: '', end_date: '' });
  questions = signal<DraftQuestion[]>([createEmptyQuestion()]);

  isPublishing = signal(false);
  errorMessage = signal<string | null>(null);
  showErrors = signal(false);

  metaErrors = computed(() => validateMeta(this.meta()));
  questionErrors = computed(() => this.questions().map(validateQuestion));
  isValid = computed(() => !hasErrors(this.metaErrors()) && !this.questionErrors().some(hasErrors));
  visibleMetaErrors = computed<MetaErrors>(() => (this.showErrors() ? this.metaErrors() : {}));

  cancelled = output<void>();
  published = output<Survey>();

  /** Errors of one question – only shown after the first click on "Publish", not while typing. */
  visibleQuestionErrors(index: number): QuestionErrors {
    return this.showErrors() ? this.questionErrors()[index] : {};
  }

  /** Replaces the question at the given position with its edited version. */
  setQuestionAt(index: number, question: DraftQuestion): void {
    this.questions.update((questions) => questions.map((q, i) => (i === index ? question : q)));
  }

  /** Adds a new, empty question at the end. */
  addQuestion(): void {
    this.questions.update((questions) => [...questions, createEmptyQuestion()]);
  }

  /** Removes the question at the given position. */
  removeQuestionAt(index: number): void {
    this.questions.update((questions) => questions.filter((_, i) => i !== index));
  }

  /** Shows all validation errors if something is missing, otherwise saves the survey. */
  async publish(): Promise<void> {
    if (this.isPublishing()) return;
    if (!this.isValid()) {
      this.showErrors.set(true);
      return;
    }
    await this.saveSurvey();
  }

  /** Saves the cleaned-up survey and reports it to the parent via `published`. */
  private async saveSurvey(): Promise<void> {
    this.isPublishing.set(true);
    this.errorMessage.set(null);
    try {
      const survey = await this.surveyService.publishSurvey(cleanMeta(this.meta()), this.questions().map(cleanQuestion));
      this.published.emit(survey);
    } catch (error) {
      console.error(error);
      this.errorMessage.set('Something went wrong while publishing your survey. Please try again.');
    } finally {
      this.isPublishing.set(false);
    }
  }
}
