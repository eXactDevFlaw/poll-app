import { Component, computed, input, signal } from '@angular/core';
import { Survey } from '../../../../core/models/survey.model';
import { isEnded } from '../../../../core/utils/survey-state';
import { SurveyCardComponent } from '../survey-card/survey-card';

type SurveyTab = 'active' | 'past';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.html',
  styleUrl: './survey-list.scss',
  imports: [SurveyCardComponent],
})
export class SurveyListComponent {
  surveys = input.required<Survey[]>();

  activeTab = signal<SurveyTab>('active');

  visibleSurveys = computed(() => {
    const showPast = this.activeTab() === 'past';
    return this.surveys().filter((survey) => isEnded(survey) === showPast);
  });
}
