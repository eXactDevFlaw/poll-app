import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DraftQuestion, NewSurveyMeta, SurveyService } from '../../core/services/survey.service';
import { Button } from '../../shared/components/button/button';
import { SurveyStatus } from '../../shared/components/survey-status/survey-status';
import { SurveyMetaForm } from './components/survey-meta-form/survey-meta-form';
import { QuestionBlock } from './components/question-block/question-block';
import { AddQuestionBtn } from './components/add-question-btn/add-question-btn';
import { PublishOverlay } from './components/publish-overlay/publish-overlay';

const CATEGORIES = [
  'Team Activities',
  'Health & Wellness',
  'Gaming & Entertainment',
  'Education & Learning',
  'Lifestyle & Preferences',
  'Technology & Innovation',
];

function emptyQuestion(): DraftQuestion {
  return { text: '', allow_multiple: false, answers: ['', ''] };
}

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrl: './create-survey.component.scss',
  imports: [RouterLink, Button, SurveyStatus, SurveyMetaForm, QuestionBlock, AddQuestionBtn, PublishOverlay],
})
export class CreateSurveyComponent {
  private surveyService = inject(SurveyService);
  private router = inject(Router);

  readonly categories = CATEGORIES;

  meta = signal<NewSurveyMeta>({ name: '', description: '', category: '', end_date: '' });
  questions = signal<DraftQuestion[]>([emptyQuestion()]);

  isPublishing = signal(false);
  showPublishedToast = signal(false);
  errorMessage = signal<string | null>(null);
  publishedSurveyId = signal<string | null>(null);

  isValid = computed(() => {
    const meta = this.meta();
    if (!meta.name.trim() || !meta.category || !meta.end_date) return false;

    return this.questions().every(
      (question) => question.text.trim().length > 0 && question.answers.filter((a) => a.trim().length > 0).length >= 2,
    );
  });

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
    if (!this.isValid() || this.isPublishing()) return;

    this.isPublishing.set(true);
    this.errorMessage.set(null);

    try {
      const survey = await this.surveyService.publishSurvey(this.meta(), this.questions());
      this.publishedSurveyId.set(survey.id);
      this.showPublishedToast.set(true);
    } catch (error) {
      console.error(error);
      this.errorMessage.set('Something went wrong while publishing your survey. Please try again.');
    } finally {
      this.isPublishing.set(false);
    }
  }

  closeToast(): void {
    this.showPublishedToast.set(false);
    const id = this.publishedSurveyId();
    if (id) this.router.navigate(['/survey', id]);
  }
}
