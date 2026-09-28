import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from '../../core/services/survey.service';
import { Survey } from '../../core/models/survey.model';
import { getEndingSoon } from '../../core/utils/survey-state';
import { SurveyListComponent } from './components/survey-list/survey-list';
import { EndingSoonSectionComponent } from './components/ending-soon-section/ending-soon-section';
import { CreateSurveyComponent } from '../create-survey/create-survey.component';
import { PublishOverlay } from '../create-survey/components/publish-overlay/publish-overlay';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [SurveyListComponent, EndingSoonSectionComponent, CreateSurveyComponent, PublishOverlay],
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

  openCreate(): void {
    this.isCreateOpen.set(true);
  }

  closeCreate(): void {
    this.isCreateOpen.set(false);
  }

  closeOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.closeCreate();
  }

  async onPublished(survey: Survey): Promise<void> {
    this.closeCreate();
    this.publishedSurvey.set(survey);
    await this.loadSurveys();
  }

  closeToast(): void {
    const survey = this.publishedSurvey();
    this.publishedSurvey.set(null);
    if (survey) this.router.navigate(['/survey', survey.id]);
  }

  async ngOnInit() {
    if (this.route.snapshot.queryParamMap.has('create')) {
      this.openCreate();
      this.router.navigate([], { queryParams: {}, replaceUrl: true });
    }

    await this.loadSurveys();
  }

  private async loadSurveys(): Promise<void> {
    this.surveys.set(await this.surveyService.getAllSurveys());
    this.isLoading.set(false);
  }
}
