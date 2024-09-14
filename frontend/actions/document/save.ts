"use server";

import { createClient } from "@/utils/supabase/server";
import { Json } from "@/packages/schema";

const supabase = createClient();

export async function saveDocumentBody(documentId: string, content: Json) {
  console.log("Saving document content", documentId, content);
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("document")
    .update({ body: content })
    .eq("id", documentId)
    .eq("user_id", user.user.id)
    .single();

  console.log("Document content saved", data, error);

  if (error) {
    console.error("Error saving document content:", error);
    throw error;
  }

  return data;
}

export async function saveDocumentTitle(documentId: string, title: string) {
  console.log("Saving document title", documentId, title);
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("document")
    .update({ title })
    .eq("id", documentId)
    .eq("user_id", user.user.id)
    .single();
}
