"use server";

import { createClient } from "@/utils/supabase/server";
import { suggestInputSchema, suggestOutputSchema } from "@/packages/schema";


export async function suggest(
  textBeforeCursor: string,
  textAfterCursor: string,
  documentId: string
) {
  const supabase = createClient();
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      throw new Error("User not authenticated");
    }

    const input = suggestInputSchema.parse({
      text_before_cursor: textBeforeCursor,
      text_after_cursor: textAfterCursor,
      document_id: documentId,
    });

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/v1/suggestions/suggest`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.data.user.id,
        },
        body: JSON.stringify(input),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const validatedOutput = suggestOutputSchema.parse(data);
    return validatedOutput;
  } catch (error) {
    console.error("Error in suggest function:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}
