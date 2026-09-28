import { Component, input, model } from '@angular/core';

import { NewSurveyMeta } from '../../../../core/services/survey.service';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';
import { InputField } from '../../../../shared/components/input-field/input-field';
import { MetaErrors, todayIso } from '../../survey-form.validation';

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

  /** Updates the survey name. */
  setName(name: string): void {
    this.meta.update((meta) => ({ ...meta, name }));
  }

  /** Updates the optional description. */
  setDescription(description: string): void {
    this.meta.update((meta) => ({ ...meta, description }));
  }

  /** Updates the optional end date ('YYYY-MM-DD' or empty). */
  setEndDate(end_date: string): void {
    this.meta.update((meta) => ({ ...meta, end_date }));
  }

  /** Updates the chosen category. */
  setCategory(category: string): void {
    this.meta.update((meta) => ({ ...meta, category }));
  }
}
