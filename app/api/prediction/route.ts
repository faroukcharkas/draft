import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  const prediction = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `
        You are a writing assistant that helps the user with ideating. Given the text below, try and guess the next twenty or so words the user will write.
        
        Guidelines:
        - Strictly return the prediction, no other text or characters.
        - Prepend the prediction with a space if it's necessary.

        The user's text: ${text}
        `,
  });

  console.log(text + prediction.text);

  return NextResponse.json({ prediction: prediction.text });
}
