"use server";

import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/packages/schema";


export async function createSample(data: {
  text: string;
  style: "FORMAL" | "CASUAL";
}): Promise<Tables<"writing_sample"> | null> {
  const supabase = createClient();
  console.log(data);
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/samples/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user.data.user.id,
      },
      body: JSON.stringify({
        text: data.text,
        style: data.style,
        user_id: user.data.user.id,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create sample");
  }

  const createdSample = await response.json();
  return createdSample;
}
