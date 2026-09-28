import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Survey } from '../../core/models/survey.model';
import { SurveyService } from '../../core/services/survey.service';
import { getEndingSoon } from '../../core/utils/survey-state';
import { PublishOverlay } from '../create-survey/components/publish-overlay/publish-overlay';
import { CreateSurveyComponent } from '../create-survey/create-survey.component';
import { EndingSoonSectionComponent } from './components/ending-soon-section/ending-soon-section';
import { Hero } from './components/hero/hero';
import { SurveyListComponent } from './components/survey-list/survey-list';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [Hero, SurveyListComponent, EndingSoonSectionComponent, CreateSurveyComponent, PublishOverlay],
  host: {
    '(document:keydown.escape)': 'closeCreate()',
  },
})
export class HomeComponent implements OnInit {
  private surveyService = inject(SurveyService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  surveys = signal<Survey[]>([]);
  endingSoon = computed(() => getEndingSoon(this.surveys()));
  isLoading = signal(true);

  isCreateOpen = signal(false);
  publishedSurvey = signal<Survey | null>(null);

  /** Loads the surveys and opens the create overlay if the URL contains `?create`. */
  async ngOnInit(): Promise<void> {
    this.openCreateFromUrl();
    await this.loadSurveys();
  }

  /** Opens the create survey overlay. */
  openCreate(): void {
    this.isCreateOpen.set(true);
  }

  /** Closes the create survey overlay (Cancel, Escape or click on the backdrop). */
  closeCreate(): void {
    this.isCreateOpen.set(false);
  }

  /** Closes the overlay only when the backdrop itself was clicked, not the card. */
  closeOnBackdrop(event: MouseEvent): void {
    const isBackdropClick = event.target === event.currentTarget;
    if (isBackdropClick) this.closeCreate();
  }

  /** Closes the overlay, shows the "published" toast and reloads the list. */
  async onPublished(survey: Survey): Promise<void> {
    this.closeCreate();
    this.publishedSurvey.set(survey);
    await this.loadSurveys();
  }

  /** Closes the toast and opens the survey that was just published. */
  closeToast(): void {
    const survey = this.publishedSurvey();
    this.publishedSurvey.set(null);
    if (survey) this.router.navigate(['/survey', survey.id]);
  }

  /** The "Create survey" button on the detail page links to `/?create=1`. */
  private openCreateFromUrl(): void {
    if (!this.route.snapshot.queryParamMap.has('create')) return;
    this.openCreate();
    this.router.navigate([], { queryParams: {}, replaceUrl: true });
  }

  /** Loads all surveys from the database. */
  private async loadSurveys(): Promise<void> {
    this.surveys.set(await this.surveyService.getAllSurveys());
    this.isLoading.set(false);
  }
}
