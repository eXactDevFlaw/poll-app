import { Component, computed, input, signal } from '@angular/core';
import { Survey } from '../../../../core/models/survey.model';
import { CATEGORIES } from '../../../../core/constants/categories';
import { isEnded } from '../../../../core/utils/survey-state';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';
import { SurveyCardComponent } from '../survey-card/survey-card';

type SurveyTab = 'active' | 'past';

const ALL_CATEGORIES = 'All Surveys';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.html',
  styleUrl: './survey-list.scss',
  imports: [Dropdown, SurveyCardComponent],
})
export class SurveyListComponent {
  surveys = input.required<Survey[]>();

  activeTab = signal<SurveyTab>('active');
  /** Empty string means "all categories". */
  selectedCategory = signal('');

  readonly categoryOptions = [ALL_CATEGORIES, ...CATEGORIES];

  /** First filter by tab (active/past), then by category – active and past surveys are never mixed. */
  visibleSurveys = computed(() => {
    const showPast = this.activeTab() === 'past';
    const category = this.selectedCategory();
    return this.surveys()
      .filter((survey) => isEnded(survey) === showPast)
      .filter((survey) => !category || survey.category === category);
  });

  selectCategory(option: string): void {
    this.selectedCategory.set(option === ALL_CATEGORIES ? '' : option);
  }

  emptyMessage(): string {
    const type = this.activeTab() === 'active' ? 'active' : 'past';
    const category = this.selectedCategory();
    return category ? `No ${type} surveys in "${category}".` : `No ${type} surveys yet.`;
  }
}
