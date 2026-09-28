import { DraftQuestion, NewSurveyMeta } from '../../core/services/survey.service';

export const MIN_ANSWERS = 2;
export const MAX_ANSWERS = 6;

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

/** Today's date as 'YYYY-MM-DD' in local time – the format of `<input type="date">`. */
export function todayIso(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * MS_PER_MINUTE);
  return local.toISOString().slice(0, ISO_DATE_LENGTH);
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

/** Trims name and description before saving. */
export function cleanMeta(meta: NewSurveyMeta): NewSurveyMeta {
  return { ...meta, name: meta.name.trim(), description: meta.description.trim() };
}
