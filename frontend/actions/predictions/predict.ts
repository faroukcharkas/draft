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
      }),
    }
  );

  const data = await response.json();
  return data.prediction;
}
