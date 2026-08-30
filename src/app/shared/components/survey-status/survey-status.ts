import { Component, input } from '@angular/core';

@Component({
  selector: 'app-survey-status',
  imports: [],
  templateUrl: './survey-status.html',
  styleUrl: './survey-status.scss',
})
export class SurveyStatus {
  status = input.required<'draft' | 'published'>();
}
