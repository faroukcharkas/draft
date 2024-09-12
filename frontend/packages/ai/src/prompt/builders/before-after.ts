import { GuidelinesBeforeAfter } from "../templates/before-after/guidelines";
import { InstructionBeforeAfter } from "../templates/before-after/instruction";
import { OutputBeforeAfter } from "../templates/before-after/output";
import { InputBeforeAfter } from "../templates/before-after/input";

export function buildBeforeAfterPrompt(before: string, after: string) {
  return `
    ${InstructionBeforeAfter(before, after)}

    ${InputBeforeAfter(before, after)}

    ${GuidelinesBeforeAfter(before, after)}
    
    ${OutputBeforeAfter(before, after)}
    `;
}
