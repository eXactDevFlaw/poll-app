import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { CreateSurveyComponent } from './features/create-survey/create-survey.component';
import { SurveyDetailComponent } from './features/survey-detail/survey-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'create', component: CreateSurveyComponent },
  { path: 'survey/:id', component: SurveyDetailComponent },
  { path: '**', redirectTo: '' },
];
