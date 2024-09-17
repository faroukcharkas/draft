"use server";

import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export async function predict(
  textBeforeCursor: string,
  textAfterCursor: string
) {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error("User not authenticated");
  }

  const { data: author } = await supabase
    .from("author")
    .select("id")
    .eq("user_id", user.data.user.id)
    .single();

  if (!author) {
    throw new Error("Author not found");
  }

  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/predictions/predict`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user.data.user.id,
      },
      body: JSON.stringify({
        textBeforeCursor,
        textAfterCursor,
        authorId: author.id,
      }),
    }
  );

  const data = await response.json();
  return data.prediction;
}
