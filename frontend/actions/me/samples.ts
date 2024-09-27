"use server";

import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/packages/schema";

const supabase = createClient();

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data;
}

export async function getSamplesFromUserId(
  userId: string
): Promise<Tables<"writing_sample">[] | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("writing_sample")
    .select("*")
    .eq("user_id", userId);
  return data;
}

export async function getSamples(): Promise<Tables<"writing_sample">[] | null> {
  const user = await getUser();
  if (!user || !user.user) {
    return null;
  }
  const samples = await getSamplesFromUserId(user.user.id);
  return samples;
}
