const CHAR_CODE_A = 65;

/**
 * Returns the letter of an answer option.
 * @param index Zero-based position of the answer (0 → "A", 1 → "B", …).
 */
export function answerLetter(index: number): string {
  return String.fromCharCode(CHAR_CODE_A + index);
}
