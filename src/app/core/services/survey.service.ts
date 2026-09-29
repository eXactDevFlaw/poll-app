import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { environment } from '../../../environments/environment';
import { Answer } from '../models/answer.model';
import { Question } from '../models/question.model';
import { Survey } from '../models/survey.model';

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

/** Thrown by {@link SurveyService.vote} when this network has already voted on the survey. */
export class AlreadyVotedError extends Error {}

@Injectable({ providedIn: 'root' })
export class SurveyService {
  private supabase: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);

  /** Loads all surveys. Returns an empty list if loading fails. */
  async getAllSurveys(): Promise<Survey[]> {
    const { data, error } = await this.supabase.from('surveys').select('*');
    if (error) console.error(error);
    return data ?? [];
  }

  /** Loads a single survey, or `null` if it does not exist. */
  async getSurveyById(id: string): Promise<Survey | null> {
    const { data, error } = await this.supabase.from('surveys').select('*').eq('id', id).single();
    if (error) console.error(error);
    return data ?? null;
  }

  /** Loads the questions of a survey including their answers, both in their saved order. */
  async getQuestionsForSurvey(surveyId: string): Promise<QuestionWithAnswers[]> {
    const { data, error } = await this.supabase
      .from('questions')
      .select('*, answers(*)')
      .eq('survey_id', surveyId)
      .order('position')
      .order('position', { referencedTable: 'answers' });
    if (error) console.error(error);
    return (data as QuestionWithAnswers[]) ?? [];
  }

  /**
   * Saves a new survey with all its questions and answers.
   * @returns The created survey.
   */
  async publishSurvey(meta: NewSurveyMeta, questions: DraftQuestion[]): Promise<Survey> {
    const survey = await this.insertSurvey(meta);
    const questionIds = await this.insertQuestions(survey.id, questions);
    await this.insertAnswers(questions, questionIds);
    return survey;
  }

  /**
   * Adds one vote to each given answer. The database function rejects ended surveys
   * and allows only one vote per survey and IP address (spam protection).
   * @throws {AlreadyVotedError} If this network has already voted on the survey.
   */
  async vote(answerIds: string[]): Promise<void> {
    const { error } = await this.supabase.rpc('vote', { answer_ids: answerIds });
    if (error?.message === 'already_voted') throw new AlreadyVotedError();
    if (error) throw error;
  }

  /**
   * Calls `onUpdate` whenever the votes of an answer of these questions change (Supabase Realtime).
   * @returns A function that stops listening – call it when the page is left.
   */
  watchVotes(surveyId: string, questionIds: string[], onUpdate: (answer: Answer) => void): () => void {
    const channel = this.supabase
      .channel(`votes-${surveyId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'answers', filter: `question_id=in.(${questionIds.join(',')})` },
        (payload) => onUpdate(payload.new as Answer),
      )
      .subscribe();
    return () => void this.supabase.removeChannel(channel);
  }

  /** Inserts the survey itself. */
  private async insertSurvey(meta: NewSurveyMeta): Promise<Survey> {
    const { data, error } = await this.supabase
      .from('surveys')
      .insert({ ...meta, status: 'published' })
      .select()
      .single();
    if (error || !data) throw error ?? new Error('Failed to create survey');
    return data;
  }

  /**
   * Inserts the questions in the given order.
   * @returns The ids of the created questions, in the same order.
   */
  private async insertQuestions(surveyId: string, questions: DraftQuestion[]): Promise<string[]> {
    const rows = questions.map((question, position) => ({
      survey_id: surveyId,
      text: question.text,
      position,
      allow_multiple: question.allow_multiple,
    }));
    const { data, error } = await this.supabase.from('questions').insert(rows).select('id');
    if (error || !data) throw error ?? new Error('Failed to create questions');
    return data.map((question) => question.id);
  }

  /** Inserts the answers of every question in the given order, all starting with 0 votes. */
  private async insertAnswers(questions: DraftQuestion[], questionIds: string[]): Promise<void> {
    const rows = questions.flatMap((question, index) =>
      question.answers.map((text, position) => ({ question_id: questionIds[index], text, position, votes: 0 })),
    );
    const { error } = await this.supabase.from('answers').insert(rows);
    if (error) throw error;
  }
}
