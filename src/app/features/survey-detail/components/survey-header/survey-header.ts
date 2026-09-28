import { Component, computed, input } from '@angular/core';

import { Survey } from '../../../../core/models/survey.model';
import { formatDate, getSurveyState } from '../../../../core/utils/survey-state';
import { SurveyStatus } from '../../../../shared/components/survey-status/survey-status';

@Component({
  selector: 'app-survey-header',
  imports: [SurveyStatus],
  templateUrl: './survey-header.html',
  styleUrl: './survey-header.scss',
})
export class SurveyHeader {
  survey = input.required<Survey>();

  state = computed(() => getSurveyState(this.survey()));

  deadline = computed(() => {
    const endDate = this.survey().end_date;
    if (!endDate) return 'No end date';
    const prefix = this.state() === 'ended' ? 'Ended on' : 'Ends on';
    return `${prefix} ${formatDate(endDate)}`;
  });
}
