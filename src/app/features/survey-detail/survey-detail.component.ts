import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QuestionWithAnswers, SurveyService } from '../../core/services/survey.service';
import { Survey } from '../../core/models/survey.model';
import { Button } from '../../shared/components/button/button';
import { SurveyHeader } from './components/survey-header/survey-header';
import { QuestionList } from './components/question-list/question-list';
import { EmptyResults } from './components/empty-results/empty-results';

@Component({
  selector: 'app-survey-detail',
  templateUrl: './survey-detail.component.html',
  styleUrl: './survey-detail.component.scss',
  imports: [RouterLink, Button, SurveyHeader, QuestionList, EmptyResults],
})
export class SurveyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private surveyService = inject(SurveyService);

  survey = signal<Survey | null>(null);
  questions = signal<QuestionWithAnswers[]>([]);
  isLoading = signal(true);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isLoading.set(false);
      return;
    }

    const [survey, questions] = await Promise.all([
      this.surveyService.getSurveyById(id),
      this.surveyService.getQuestionsForSurvey(id),
    ]);

    this.survey.set(survey);
    this.questions.set(questions);
    this.isLoading.set(false);
  }
}
