export function BeginningOfText(): string {
  return `
  Provide your suggestion below, using only plain text without any XML tags, and with no extra words:
  `;
}

export function MiddleOfText(): string {
  return `
  Provide your suggestion below, using only plain text without any markup, and with no extra words:
  `;
}

export function EndOfText(): string {
  return `
  Provide your suggestion below, using only plain text without any markup, and with no extra words:
  `;
}

export function OutputBeforeAfter(before: string, after: string): string {
  if (before.length === 0) {
    return BeginningOfText();
  } else if (after.length === 0) {
    return EndOfText();
  } else {
    return MiddleOfText();
  }
}
