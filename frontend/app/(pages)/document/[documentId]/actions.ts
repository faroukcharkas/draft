"use server";

import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/packages/schema";

export async function getDocument(
  documentId: string
): Promise<Tables<"document"> | null> {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return null;
  }

  const { data: document, error } = await supabase
    .from("document")
    .select("*")
    .eq("id", documentId)
    .eq("user_id", user.user.id)
    .single();

  if (error) {
    console.error("Error fetching document:", error);
    return null;
  }

  return document as Tables<"document">;
}
