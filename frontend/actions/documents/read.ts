"use server";

import { createClient } from "@/utils/supabase/server";

export async function readDocument(documentId: string) {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("document")
    .select("*")
    .eq("id", documentId)
    .eq("user_id", user.user.id)
    .single();

  if (error) {
    console.error("Error reading document:", error);
    throw error;
  }

  return data;
}