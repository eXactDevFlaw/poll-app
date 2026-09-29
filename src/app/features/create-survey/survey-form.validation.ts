import { DraftQuestion, NewSurveyMeta } from '../../core/services/survey.service';

export const MIN_ANSWERS = 2;
export const MAX_ANSWERS = 6;
/** Maximum text lengths – also enforced by check constraints in the database. */
export const MAX_LENGTH = {
  name: 80,
  description: 500,
  question: 150,
  answer: 100,
} as const;
/** Every survey ends – if the user does not choose a date, it runs for this many days. */
export const DEFAULT_DURATION_DAYS = 7;

const MS_PER_MINUTE = 60 * 1000;
const ISO_DATE_LENGTH = 'YYYY-MM-DD'.length;

export interface MetaErrors {
  name?: string;
  category?: string;
  endDate?: string;
}

export interface QuestionErrors {
  text?: string;
  answers?: string;
}

/** Returns a new question with an empty text and the minimum number of empty answers. */
export function createEmptyQuestion(): DraftQuestion {
  return { text: '', allow_multiple: false, answers: Array(MIN_ANSWERS).fill('') };
}

/** A date as 'YYYY-MM-DD' in local time – the format of `<input type="date">`. */
function toIsoDay(date: Date): string {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * MS_PER_MINUTE);
  return local.toISOString().slice(0, ISO_DATE_LENGTH);
}

/** Today's date as 'YYYY-MM-DD' in local time. */
export function todayIso(): string {
  return toIsoDay(new Date());
}

/** The end date used when the user does not choose one: today + {@link DEFAULT_DURATION_DAYS}. */
export function defaultEndDate(today: Date = new Date()): string {
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + DEFAULT_DURATION_DAYS);
  return toIsoDay(endDate);
}

/** Checks name, category and end date. Fields without an error are `undefined`. */
export function validateMeta(meta: NewSurveyMeta, today: string = todayIso()): MetaErrors {
  const isEndDateInPast = !!meta.end_date && meta.end_date < today;
  return {
    name: meta.name.trim() ? undefined : 'Please enter a survey name.',
    category: meta.category ? undefined : 'Please choose a category.',
    endDate: isEndDateInPast ? 'The end date cannot be in the past.' : undefined,
  };
}

/** Checks the question text and its answers. Fields without an error are `undefined`. */
export function validateQuestion(question: DraftQuestion): QuestionErrors {
  return {
    text: question.text.trim() ? undefined : 'Please enter a question.',
    answers: validateAnswers(question.answers),
  };
}

/** Every visible answer field must be filled – empty fields have to be removed by the user. */
function validateAnswers(answers: string[]): string | undefined {
  if (answers.length < MIN_ANSWERS) return `Please add at least ${MIN_ANSWERS} answers.`;
  if (answers.some((answer) => !answer.trim())) return 'Please fill in all answer fields or remove the empty ones.';
  return undefined;
}

/** Whether at least one field has an error message. */
export function hasErrors(errors: MetaErrors | QuestionErrors): boolean {
  return Object.values(errors).some(Boolean);
}

/** Trims all texts and drops empty answer fields, so they are not saved as answer options. */
export function cleanQuestion(question: DraftQuestion): DraftQuestion {
  return {
    ...question,
    text: question.text.trim(),
    answers: question.answers.map((answer) => answer.trim()).filter(Boolean),
  };
}

/** Trims name and description before saving. A cleared end date falls back to the default duration. */
export function cleanMeta(meta: NewSurveyMeta): NewSurveyMeta {
  return {
    ...meta,
    name: meta.name.trim(),
    description: meta.description.trim(),
    end_date: meta.end_date || defaultEndDate(),
  };
}
