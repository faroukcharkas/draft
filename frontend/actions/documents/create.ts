"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export async function createDocumentThenRedirect(startDescription: string) {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("document")
    .insert({
      user_id: user.user.id,
      description: startDescription,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("Error creating document:", error);
    throw error;
  }

  redirect(`/document/${data.id}`);
}
