import { Component, input, model } from '@angular/core';
import { NewSurveyMeta } from '../../../../core/services/survey.service';
import { InputField } from '../../../../shared/components/input-field/input-field';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';
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

  setName(name: string): void {
    this.meta.update((meta) => ({ ...meta, name }));
  }

  setDescription(description: string): void {
    this.meta.update((meta) => ({ ...meta, description }));
  }

  setEndDate(end_date: string): void {
    this.meta.update((meta) => ({ ...meta, end_date }));
  }

  setCategory(category: string): void {
    this.meta.update((meta) => ({ ...meta, category }));
  }
}
