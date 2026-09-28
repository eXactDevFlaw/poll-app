import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Survey } from '../../../../core/models/survey.model';
import { getDaysLabel } from '../../../../core/utils/survey-state';

@Component({
  selector: 'app-ending-soon-section',
  imports: [RouterLink],
  templateUrl: './ending-soon-section.html',
  styleUrl: './ending-soon-section.scss',
})
export class EndingSoonSectionComponent {
  surveys = input.required<Survey[]>();

  readonly getDaysLabel = getDaysLabel;
}
