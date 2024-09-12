export function BeginningOfText(): string {
  /*
  Meant to be used when the author is stuck at the beginning of the text.
  */
  return `
    Guidelines:
    1. If the user's text already has a strong start, simply return the first word.
    2. If a beginning is needed, create a short, engaging phrase (1-3 words) that leads into the user's text.
    3. Ensure your suggestion matches the tone and style of the existing text.
    4. Consider the context and subject matter when making your suggestion.
    5. Avoid adding unnecessary information or changing the meaning of the original text.
    `;
}

export function MiddleOfText(): string {
  /*
  Meant to be used when the author is stuck in the middle of the text.
  This should be only used if there's a lack of clarity or grammatical correctness in the text.

  For example:
  "I love cats. I wish I could take it outside."
  The AI should recognize this is an unclear sentence and should suggest "cats. I have one named Fluffy. I"
  */
  return `
    Guidelines:
    1. Analyze the before and after text for context, style, and tone.
    2. Identify any lack of clarity, grammatical issues, or disconnects between the two parts.
    3. If the text is already clear and grammatically correct, simply return the first word of the after text.
    4. If improvements are needed:
       a. Create a brief, coherent bridge (1-3 words) that connects the two parts seamlessly.
       b. Ensure your suggestion maintains the original meaning and intent of the text.
       c. Correct any grammatical errors or unclear references.
       d. Maintain consistency in tense, person, and number with the surrounding text.
    5. Match the tone and style of the existing text in your suggestion.
    6. Avoid adding unnecessary information or significantly changing the meaning of the original text.
    7. If multiple options are viable, choose the most concise and natural-sounding suggestion.
    8. Double-check that your suggestion flows smoothly with both the before and after text.
    `;
}

export function EndOfText(): string {
  /*
  Meant to be used when the author is stuck at the end of the text.

  For example:
  "My name is Johnathon, and I'm a student at _____."
  The AI should fill in with "student at Stanford University."
  The AI should ideally pad the suggestion with the actual user's text.
  */
  return `
    Guidelines:
    1. Analyze context and subject matter.
    2. Predict a natural, appropriate ending.
    3. Keep suggestion concise.
    4. Match tone and style of existing text.
    6. Incorporate existing text for continuity if possible.
    7. Avoid unnecessary information or meaning changes.
    8. If text seems complete, suggest only the next word or punctuation.
    `;
}

export function GuidelinesBeforeAfter(before: string, after: string): string {
  if (before.length === 0) {
    return BeginningOfText();
  } else if (after.length === 0) {
    return EndOfText();
  } else {
    return MiddleOfText();
  }
}
