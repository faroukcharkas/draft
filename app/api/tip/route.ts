import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from '@ai-sdk/openai';

export async function POST(req: NextRequest) {
    const { currentText } = await req.json();

    const tip = await generateText({
        model: openai("gpt-4o-mini"),
        prompt: `
        You are a writing assistant that helps the user with ideating. Given the text below, try and guess the next twenty or so words the user will write.

        Guidelines:
        - Do not return anything else but the continuation of the text.
        - Do not return any other text like "The next words are..." or "The user will write..."
        - Write in the same style as the user's text.
        
        The user's text: ${currentText}
        `,
    });

    console.log(tip.text);

    return NextResponse.json({ tip: tip.text });
}