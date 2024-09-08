import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from '@ai-sdk/openai';

export async function POST(req: NextRequest) {
    const { currentText } = await req.json();

    const tip = await generateText({
        model: openai("gpt-4o-mini"),
        prompt: `
        You are a writing assistant that helps with writing. Given the text below, either fix any errors or suggest a continution of the text.

        Text: ${currentText}
        
        Do not return anything else but either the revised text or the continuation:
        `,
    });

    return NextResponse.json({ tip: tip.text });
}