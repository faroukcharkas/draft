"use server";

import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/packages/schema";

const supabase = createClient();

export async function createSample(data: {
  text: string;
  style: "FORMAL" | "CASUAL";
}): Promise<Tables<"writing_sample"> | null> {
  console.log(data);
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

  console.log("Author ID", author.id);

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
        author_id: author.id,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create sample");
  }

  const createdSample = await response.json();
  return createdSample;
}
