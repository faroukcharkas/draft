"use server";

import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/packages/schema";

const supabase = createClient();

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data;
}

type Author = Tables<"author">;

export async function getAuthorFromUserId(
  userId: string
): Promise<Author | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("author")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data;
}

export async function getSamplesFromAuthor(
  authorId: string
): Promise<Tables<"writing_sample">[] | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("writing_sample")
    .select("*")
    .eq("author_id", authorId);
  return data;
}

export async function getSamples(): Promise<Tables<"writing_sample">[] | null> {
  const user = await getUser();
  if (!user || !user.user) {
    return null; // or throw an error, depending on your error handling strategy
  }
  const author = await getAuthorFromUserId(user.user.id);
  if (!author) {
    return null; // or throw an error
  }
  const samples = await getSamplesFromAuthor(author.id);
  return samples;
}
