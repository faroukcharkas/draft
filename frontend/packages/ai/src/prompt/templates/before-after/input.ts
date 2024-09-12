export function BeginningOfText(after: string): string {
  return `
    Given:
    - After text: "${after}"
    `;
}

export function EndOfText(before: string): string {
  return `
    Given:
    - Before text: "${before}"
    `;
}

export function MiddleOfText(before: string, after: string): string {
  return `
    Given:
    - Before text: "${before}"
    - After text: "${after}"
    `;
}

export function InputBeforeAfter(before: string, after: string): string {
  if (before.length === 0) {
    return BeginningOfText(after);
  } else if (after.length === 0) {
    return EndOfText(before);
  } else {
    return MiddleOfText(before, after);
  }
}
