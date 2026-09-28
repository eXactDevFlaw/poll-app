import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Survey } from '../../../../core/models/survey.model';
import { getDaysLabel } from '../../../../core/utils/survey-state';

@Component({
  selector: 'app-survey-card',
  imports: [RouterLink],
  templateUrl: './survey-card.html',
  styleUrl: './survey-card.scss',
})
export class SurveyCardComponent {
  survey = input.required<Survey>();

  daysLabel = computed(() => getDaysLabel(this.survey()));
}
