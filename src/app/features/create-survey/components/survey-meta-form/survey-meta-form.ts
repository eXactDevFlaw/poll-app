import { Component, input, model } from '@angular/core';

import { NewSurveyMeta } from '../../../../core/services/survey.service';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';
import { InputField } from '../../../../shared/components/input-field/input-field';
import { MAX_LENGTH, MetaErrors, todayIso } from '../../survey-form.validation';

@Component({
  selector: 'app-survey-meta-form',
  imports: [InputField, Dropdown],
  templateUrl: './survey-meta-form.html',
  styleUrl: './survey-meta-form.scss',
})
export class SurveyMetaForm {
  categories = input<string[]>([]);
  errors = input<MetaErrors>({});
  meta = model.required<NewSurveyMeta>();

  readonly today = todayIso();
  readonly maxLength = MAX_LENGTH;

  /** Updates the survey name. */
  setName(name: string): void {
    this.meta.update((meta) => ({ ...meta, name }));
  }

  /** Updates the optional description. */
  setDescription(description: string): void {
    this.meta.update((meta) => ({ ...meta, description }));
  }

  /** Updates the end date ('YYYY-MM-DD'). If cleared, the default of 7 days is used when publishing. */
  setEndDate(end_date: string): void {
    this.meta.update((meta) => ({ ...meta, end_date }));
  }

  /** Updates the chosen category. */
  setCategory(category: string): void {
    this.meta.update((meta) => ({ ...meta, category }));
  }
}
