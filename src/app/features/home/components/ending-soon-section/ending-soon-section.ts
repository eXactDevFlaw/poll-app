import { Component, input } from '@angular/core';
import { Survey } from '../../../../core/models/survey.model';
import { getDaysLabel } from '../../../../core/utils/survey-state';

@Component({
  selector: 'app-ending-soon-section',
  templateUrl: './ending-soon-section.html',
  styleUrl: './ending-soon-section.scss',
})
export class EndingSoonSectionComponent {
  surveys = input.required<Survey[]>();

  readonly getDaysLabel = getDaysLabel;
}
