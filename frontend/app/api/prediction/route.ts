import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { PromptBuilder } from "@pentip/ai";
import { predictRequestSchema } from "@pentip/schema";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log(body);
  const result = predictRequestSchema.safeParse(body);

  console.log(result);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { textBeforeCursor, textAfterCursor } = result.data;

  const prediction = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: PromptBuilder.buildBeforeAfterPrompt(
      textBeforeCursor,
      textAfterCursor
    ),
  });

  console.log(textBeforeCursor + prediction.text + textAfterCursor);

  return NextResponse.json({ prediction: prediction.text });
}
