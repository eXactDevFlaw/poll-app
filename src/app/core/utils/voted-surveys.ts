const STORAGE_KEY = 'poll-app:voted-surveys';

/**
 * Reads the ids of all surveys this browser has already voted on.
 * localStorage can be blocked (e.g. private mode) – then nothing is remembered.
 */
function readVotedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

/** Whether this browser has already voted on the survey. */
export function hasVoted(surveyId: string): boolean {
  return readVotedIds().includes(surveyId);
}

/** Remembers that this browser has voted on the survey, so it cannot vote twice. */
export function markVoted(surveyId: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...readVotedIds(), surveyId]));
  } catch {
    return;
  }
}
