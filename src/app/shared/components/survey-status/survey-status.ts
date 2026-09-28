import { Component, computed, input } from '@angular/core';

import { SurveyState } from '../../../core/utils/survey-state';

const LABELS: Record<SurveyState, string> = {
  draft: 'Draft',
  active: 'Active',
  ended: 'Ended',
};

@Component({
  selector: 'app-survey-status',
  imports: [],
  templateUrl: './survey-status.html',
  styleUrl: './survey-status.scss',
})
export class SurveyStatus {
  status = input.required<SurveyState>();

  label = computed(() => LABELS[this.status()]);
}
