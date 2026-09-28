const STORAGE_KEY = 'poll-app:voted-surveys';

/**
 * Remembers in the browser which surveys the user has already voted on, so the same
 * browser cannot vote twice. localStorage can be blocked (e.g. private mode), so every
 * access is wrapped in try/catch – voting still works then, it just is not remembered.
 */
function readVotedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function hasVoted(surveyId: string): boolean {
  return readVotedIds().includes(surveyId);
}

export function markVoted(surveyId: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...readVotedIds(), surveyId]));
  } catch {
    // Storage not available – nothing to remember
  }
}
