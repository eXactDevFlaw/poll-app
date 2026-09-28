import { Component, computed, inject, output, signal } from '@angular/core';
import { DraftQuestion, NewSurveyMeta, SurveyService } from '../../core/services/survey.service';
import { Survey } from '../../core/models/survey.model';
import { CATEGORIES } from '../../core/constants/categories';
import { Button } from '../../shared/components/button/button';
import { SurveyStatus } from '../../shared/components/survey-status/survey-status';
import { SurveyMetaForm } from './components/survey-meta-form/survey-meta-form';
import { QuestionBlock } from './components/question-block/question-block';
import { AddQuestionBtn } from './components/add-question-btn/add-question-btn';
import {
  cleanMeta,
  cleanQuestion,
  hasErrors,
  MetaErrors,
  QuestionErrors,
  validateMeta,
  validateQuestion,
} from './survey-form.validation';

function emptyQuestion(): DraftQuestion {
  return { text: '', allow_multiple: false, answers: ['', ''] };
}

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
  questions = signal<DraftQuestion[]>([emptyQuestion()]);

  isPublishing = signal(false);
  errorMessage = signal<string | null>(null);

  /** Errors are only shown after the first click on "Publish", not while the user is still typing. */
  showErrors = signal(false);

  metaErrors = computed(() => validateMeta(this.meta()));
  questionErrors = computed(() => this.questions().map(validateQuestion));

  isValid = computed(() => !hasErrors(this.metaErrors()) && !this.questionErrors().some(hasErrors));

  visibleMetaErrors = computed<MetaErrors>(() => (this.showErrors() ? this.metaErrors() : {}));

  cancelled = output<void>();
  published = output<Survey>();

  visibleQuestionErrors(index: number): QuestionErrors {
    return this.showErrors() ? this.questionErrors()[index] : {};
  }

  setQuestionAt(index: number, question: DraftQuestion): void {
    this.questions.update((questions) => questions.map((q, i) => (i === index ? question : q)));
  }

  addQuestion(): void {
    this.questions.update((questions) => [...questions, emptyQuestion()]);
  }

  removeQuestionAt(index: number): void {
    this.questions.update((questions) => questions.filter((_, i) => i !== index));
  }

  async publish(): Promise<void> {
    if (this.isPublishing()) return;
    if (!this.isValid()) {
      this.showErrors.set(true);
      return;
    }
    await this.saveSurvey();
  }

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
