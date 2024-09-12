export function BeginningOfText(): string {
  return `
    You are tasked with suggesting a compelling start to the user's text. Your goal is to provide a natural and contextually appropriate beginning that seamlessly flows into the existing content.
    `;
}

export function EndOfText(): string {
  return `
    You must predict the next words the user will write. Only predict as many words as approrpriate.
    `;
}

export function MiddleOfText(): string {
  return `You are an expert writer tasked with seamlessly connecting two parts of a sentence or paragraph. Your goal is to provide a natural and contextually appropriate bridge that maintains the flow and coherence of the text.`;
}

export function InstructionBeforeAfter(before: string, after: string): string {
  if (before.length === 0) {
    return BeginningOfText();
  } else if (after.length === 0) {
    return EndOfText();
  } else {
    return MiddleOfText();
  }
}
