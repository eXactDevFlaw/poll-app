import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Survey } from '../../../../core/models/survey.model';
import { getDaysLabel, getSurveyState } from '../../../../core/utils/survey-state';
import { SurveyStatus } from '../../../../shared/components/survey-status/survey-status';

@Component({
  selector: 'app-survey-card',
  imports: [RouterLink, SurveyStatus],
  templateUrl: './survey-card.html',
  styleUrl: './survey-card.scss',
})
export class SurveyCardComponent {
  survey = input.required<Survey>();

  state = computed(() => getSurveyState(this.survey()));
  daysLabel = computed(() => getDaysLabel(this.survey()));
}
