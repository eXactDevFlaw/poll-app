import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SurveyService } from '../../core/services/survey.service';
import { Survey } from '../../core/models/survey.model';
import { SurveyListComponent } from './components/survey-list/survey-list';
import { EndingSoonSectionComponent } from './components/ending-soon-section/ending-soon-section';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [SurveyListComponent, EndingSoonSectionComponent],
})
export class HomeComponent implements OnInit {
  private surveyService = inject(SurveyService);
  private router = inject(Router);

  surveys = signal<Survey[]>([]);
  endingSoon = signal<Survey[]>([]);
  isLoading = signal(true);

  goToCreate(): void {
    this.router.navigate(['/create']);
  }

  async ngOnInit() {
    const [allSurveys, endingSoon] = await Promise.all([
      this.surveyService.getAllSurveys(),
      this.surveyService.getEndingSoonSurveys(),
    ]);

    this.surveys.set(allSurveys);
    this.endingSoon.set(endingSoon);
    this.isLoading.set(false);
  }
}
