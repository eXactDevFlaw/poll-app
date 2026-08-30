import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Survey } from '../models/survey.model';
import { Question } from '../models/question.model';
import { Answer } from '../models/answer.model';

export interface NewSurveyMeta {
  name: string;
  description: string;
  category: string;
  end_date: string;
}

export interface DraftQuestion {
  text: string;
  allow_multiple: boolean;
  answers: string[];
}

export type QuestionWithAnswers = Question & { answers: Answer[] };

@Injectable({ providedIn: 'root' })
export class SurveyService {
  private supabase: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);

  async getAllSurveys(): Promise<Survey[]> {
    const { data, error } = await this.supabase.from('surveys').select('*');

    if (error) console.error(error);
    return data ?? [];
  }

  async getEndingSoonSurveys(): Promise<Survey[]> {
    const { data, error } = await this.supabase
      .from('surveys')
      .select('*')
      .eq('status', 'published')
      .order('end_date', { ascending: true })
      .limit(3);

    if (error) console.error(error);
    return data ?? [];
  }

  async getSurveyById(id: string): Promise<Survey | null> {
    const { data, error } = await this.supabase.from('surveys').select('*').eq('id', id).single();

    if (error) console.error(error);
    return data ?? null;
  }

  async getQuestionsForSurvey(surveyId: string): Promise<QuestionWithAnswers[]> {
    const { data, error } = await this.supabase
      .from('questions')
      .select('*, answers(*)')
      .eq('survey_id', surveyId)
      .order('position');

    if (error) console.error(error);
    return (data as QuestionWithAnswers[]) ?? [];
  }

  async publishSurvey(meta: NewSurveyMeta, questions: DraftQuestion[]): Promise<Survey> {
    const { data: survey, error: surveyError } = await this.supabase
      .from('surveys')
      .insert({ ...meta, status: 'published' })
      .select()
      .single();

    if (surveyError || !survey) throw surveyError ?? new Error('Failed to create survey');

    const { data: createdQuestions, error: questionsError } = await this.supabase
      .from('questions')
      .insert(
        questions.map((question, index) => ({
          survey_id: survey.id,
          text: question.text,
          position: index,
          allow_multiple: question.allow_multiple,
        })),
      )
      .select();

    if (questionsError || !createdQuestions) throw questionsError ?? new Error('Failed to create questions');

    const answersPayload = questions.flatMap((question, index) =>
      question.answers.map((text) => ({ question_id: createdQuestions[index].id, text, votes: 0 })),
    );

    const { error: answersError } = await this.supabase.from('answers').insert(answersPayload);

    if (answersError) throw answersError;

    return survey;
  }
}
