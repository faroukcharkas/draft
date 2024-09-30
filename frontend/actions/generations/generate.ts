"use server";

import { createClient } from "@/utils/supabase/server";
import { generateInputSchema, generateOutputSchema } from "@/packages/schema";

export async function generate(
  selection: string,
  command: string
) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error("User not authenticated");
  }

  const input = generateInputSchema.parse({
    selection: selection,
    command: command,
  });

  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/generations/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const validatedOutput = generateOutputSchema.parse(data);
  return validatedOutput;
}
