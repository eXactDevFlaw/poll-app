import { Survey } from '../models/survey.model';

export type SurveyState = 'draft' | 'active' | 'ended';

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const ENDING_SOON_LIMIT = 3;

/**
 * Reads the calendar day of a 'YYYY-MM-DD' (or ISO timestamp) string as local midnight.
 * `new Date('2026-09-28')` would be UTC midnight, which shifts the day in other time zones.
 */
function toLocalDay(date: string): Date {
  const [year, month, day] = date.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Days until the survey ends: 0 on the end date itself, negative once it has ended.
 * Returns null for surveys without an end date.
 */
export function daysLeft(survey: Survey, today = new Date()): number | null {
  if (!survey.end_date) return null;
  const diff = toLocalDay(survey.end_date).getTime() - startOfDay(today).getTime();
  return Math.round(diff / MS_PER_DAY);
}

/**
 * A survey stays active through its whole end date and has ended from the next day on.
 * Surveys without an end date never end.
 */
export function getSurveyState(survey: Survey, today = new Date()): SurveyState {
  if (survey.status === 'draft') return 'draft';
  const days = daysLeft(survey, today);
  return days !== null && days < 0 ? 'ended' : 'active';
}

export function isEnded(survey: Survey, today = new Date()): boolean {
  return getSurveyState(survey, today) === 'ended';
}

/** Active surveys with an end date, soonest first. Surveys without an end date are never "ending soon". */
export function getEndingSoon(surveys: Survey[], today = new Date(), limit = ENDING_SOON_LIMIT): Survey[] {
  return surveys
    .filter((survey) => survey.end_date && getSurveyState(survey, today) === 'active')
    .sort((a, b) => daysLeft(a, today)! - daysLeft(b, today)!)
    .slice(0, limit);
}

export function getDaysLabel(survey: Survey, today = new Date()): string {
  const days = daysLeft(survey, today);
  if (days === null) return 'No end date';
  if (days < 0) return 'Ended';
  if (days === 0) return 'Ends today';
  return days === 1 ? 'Ends in 1 Day' : `Ends in ${days} Days`;
}
