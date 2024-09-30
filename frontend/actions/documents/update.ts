"use server";

import { createClient } from "@/utils/supabase/server";
import { Json } from "@/packages/schema";

const supabase = createClient();

export async function updateDocumentBody(documentId: string, content: Json) {
  console.log("Saving document content", documentId, content);
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("document")
    .update({ body: content, updated_at: new Date().toISOString() })
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

export async function updateDocumentTitle(documentId: string, title: string) {
  console.log("Saving document title", documentId, title);
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("document")
    .update({ title, updated_at: new Date().toISOString() })
    .eq("id", documentId)
    .eq("user_id", user.user.id)
    .single();
}

export async function updateDocumentDescription(documentId: string, description: string) {
  console.log("Saving document description", documentId, description);
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("document")
    .update({ description, updated_at: new Date().toISOString() })
    .eq("id", documentId)
    .eq("user_id", user.user.id)
    .single();
  
  if (error) {
    console.error("Error saving document description:", error);
    throw error;
  }
}